/** Fixed, patient-independent query against the official ClinicalTrials.gov API. */
export const CTG_QUERY_URL = 'https://clinicaltrials.gov/api/v2/studies?format=json&query.cond=testicular%20cancer&pageSize=100&countTotal=true&sort=LastUpdatePostDate:desc'

export async function fetchClinicalTrials({ fetchImpl = fetch, signal } = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 12000)
  const onAbort = () => controller.abort()
  signal?.addEventListener('abort', onAbort, { once: true })
  try {
    const response = await fetchImpl(CTG_QUERY_URL, {
      headers: { accept: 'application/json' }, signal: controller.signal,
    })
    if (!response.ok) throw new Error(`ClinicalTrials.gov 返回 HTTP ${response.status}`)
    const body = await response.json()
    if (!Array.isArray(body.studies) || !Number.isInteger(body.totalCount)) throw new Error('ClinicalTrials.gov 返回格式不完整')
    const studies = body.studies.map((item) => {
      const protocol = item.protocolSection || {}
      const id = protocol.identificationModule?.nctId
      if (!/^NCT\d{8}$/.test(id || '')) return null
      return {
        id,
        title: String(protocol.identificationModule?.briefTitle || '标题未提供'),
        status: String(protocol.statusModule?.overallStatus || '状态未提供'),
        updated: String(protocol.statusModule?.lastUpdatePostDateStruct?.date || ''),
        conditions: Array.isArray(protocol.conditionsModule?.conditions) ? protocol.conditionsModule.conditions.map(String).slice(0, 8) : [],
        url: `https://clinicaltrials.gov/study/${id}`,
      }
    }).filter((study) => study && /testicul|seminoma/i.test([study.title, ...study.conditions].join(' '))).slice(0, 20)
    return {
      source: 'ClinicalTrials.gov',
      sourceUrl: 'https://clinicaltrials.gov/data-api/api',
      query: 'testicular cancer',
      retrievedAt: new Date().toISOString(),
      totalCount: body.totalCount,
      examinedCount: body.studies.length,
      studies,
      note: '官方宽词返回记录按更新时间排序；仅从本次取得的最多 100 条中展示标题或条件含睾丸/精原细胞瘤英文词的记录。机械词筛不是临床审核，不代表可入组或适合个人。',
    }
  } finally {
    clearTimeout(timer)
    signal?.removeEventListener('abort', onAbort)
  }
}
