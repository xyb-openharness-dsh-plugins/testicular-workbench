import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchClinicalTrials, CTG_QUERY_URL } from '../dsh/clinical.js'

test('官方登记查询只发送固定病种词，保留来源与原始登记链接', async () => {
  const calls = []
  const result = await fetchClinicalTrials({ fetchImpl: async (url, options) => {
    calls.push({ url, options })
    return { ok: true, json: async () => ({ totalCount: 1, studies: [{ protocolSection: {
      identificationModule: { nctId: 'NCT02099734', briefTitle: 'Germ Cell Tumor and Testicular Tumor DNA Registry' },
      statusModule: { overallStatus: 'RECRUITING', studyLastUpdatePostDateStruct: { date: '2026-02-04' } },
      conditionsModule: { conditions: ['Testicular Tumor'] },
    } }] }) }
  } })
  assert.equal(calls.length, 1)
  assert.equal(calls[0].url, CTG_QUERY_URL)
  assert.equal(result.totalCount, 1)
  assert.equal(result.studies[0].url, 'https://clinicaltrials.gov/study/NCT02099734')
  assert.match(result.note, /不是临床审核/)
})

test('官方源失败不变成零结果', async () => {
  await assert.rejects(fetchClinicalTrials({ fetchImpl: async () => ({ ok: false, status: 503 }) }), /HTTP 503/)
  await assert.rejects(fetchClinicalTrials({ fetchImpl: async () => ({ ok: true, json: async () => ({ studies: [] }) }) }), /格式不完整/)
})

test('机械词筛排除宽词误命中的无关记录', async () => {
  const make = (id, title, conditions) => ({ protocolSection: {
    identificationModule: { nctId: id, briefTitle: title },
    conditionsModule: { conditions },
  } })
  const result = await fetchClinicalTrials({ fetchImpl: async () => ({ ok: true, json: async () => ({
    totalCount: 2,
    studies: [make('NCT00000001', 'Esophageal cancer vaccine', ['Esophageal Cancer']), make('NCT00000002', 'Testicular cancer follow-up', ['Testicular Cancer'])],
  }) }) })
  assert.deepEqual(result.studies.map((study) => study.id), ['NCT00000002'])
  assert.equal(result.examinedCount, 2)
  assert.equal(result.totalCount, 2)
})
