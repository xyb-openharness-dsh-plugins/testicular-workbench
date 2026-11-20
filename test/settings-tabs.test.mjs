import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createContext, runInContext } from 'node:vm'

test('Desktop 设置三 Tab 可操作：Token 输入保存与本机目录选择', async () => {
  const slots = []
  let cursor = 0
  let registration
  let picked = 0
  const requests = []
  const React = {
    createElement: (type, props, ...children) => ({ type, props: props || {}, children }),
    useState(initial) {
      const index = cursor++
      if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial
      return [slots[index], (next) => { slots[index] = typeof next === 'function' ? next(slots[index]) : next }]
    },
    useRef: () => ({ current: null }),
    useEffect: () => {},
  }
  const host = {
    effect: (fn) => fn(),
    desktopWorkbenches: {
      register: (_descriptor, component) => { registration = component },
      currentSession: () => null,
      ownsSession: () => false,
    },
    uiWorkspace: { pickDirectory: async () => { picked++; return '/Users/example/Downloads/TestiPal-data' } },
  }
  const win = { __ModuleLoader__: { load: (module) => { win.module = module } } }
  const fetch = async (url, options = {}) => {
    requests.push({ url, options })
    return { ok: true, json: async () => url.endsWith('/root')
      ? { dir: '/Users/example/Downloads/TestiPal-data' }
      : { sourceLabel: '已保存', masked: 'sk-****12', fileExists: true } }
  }
  const context = createContext({ window: win, localStorage: { getItem: () => null }, console, fetch })
  runInContext(readFileSync(new URL('../lib/client.js', import.meta.url), 'utf8'), context)
  const client = win.module.factory((name) => {
    assert.equal(name, 'react')
    return React
  })
  assert.ok(client.inject.includes('uiWorkspace'))
  client.apply(host)

  const flatten = (node) => Array.isArray(node) ? node.flatMap(flatten) : node && typeof node === 'object'
    ? [node, ...(node.children || []).flatMap(flatten)] : []
  const render = () => { cursor = 0; return flatten(registration({ conversation: null })) }
  const byText = (nodes, text) => nodes.find((node) => node.type === 'button' && node.children.includes(text))
  const content = (nodes) => nodes.flatMap((node) => node.children.filter((child) => typeof child === 'string')).join(' ')

  let nodes = render()
  assert.equal(nodes.filter((node) => node.props['aria-label'] === '设置').length, 1)
  byText(nodes, '⚙').props.onClick()
  nodes = render()
  assert.ok(nodes.some((node) => node.props.role === 'dialog' && node.props['aria-modal'] === 'true'))
  assert.deepEqual(nodes.filter((node) => node.props.role === 'tab').map((node) => node.children[0]), ['工作区', '文档解析（MinerU）', '临床数据库'])
  assert.match(content(nodes), /选择资料目录/)

  byText(nodes, '文档解析（MinerU）').props.onClick()
  nodes = render()
  assert.match(content(nodes), /MinerU Token/)
  assert.match(content(nodes), /文档会经由 MinerU API 上传至其服务/)
  assert.match(content(nodes), /上传前请先检查并脱敏个人隐私信息/)
  assert.doesNotMatch(content(nodes), /当前不会上传文件或调用 MinerU/)
  const tokenInput = nodes.find((node) => node.type === 'input' && node.props.type === 'password')
  assert.equal(tokenInput.props.disabled, false, 'Token 输入不应因未来上传提示而禁用')
  tokenInput.props.onChange({ target: { value: 'sk-test-token-12' } })
  nodes = render()
  assert.equal(byText(nodes, '保存 Token').props.disabled, false)
  byText(nodes, '保存 Token').props.onClick()
  await new Promise((resolve) => setImmediate(resolve))
  assert.ok(requests.some((request) => request.url.endsWith('/settings/mineru') && request.options.method === 'POST'))
  assert.equal(byText(nodes, '文档解析（MinerU）').props['aria-selected'], true)

  byText(nodes, '工作区').props.onClick()
  nodes = render()
  byText(nodes, '选择资料目录').props.onClick()
  await new Promise((resolve) => setImmediate(resolve))
  assert.equal(picked, 1, '必须调起宿主目录选择器')
  assert.ok(requests.some((request) => request.url.endsWith('/root') && request.options.method === 'POST'))

  byText(nodes, '临床数据库').props.onClick()
  nodes = render()
  assert.match(content(nodes), /ClinicalTrials.gov 官方登记源/)
  assert.equal(byText(nodes, '临床数据库').props['aria-selected'], true)

  nodes.find((node) => node.props['aria-label'] === '关闭设置').props.onClick()
  assert.ok(!render().some((node) => node.props.role === 'dialog'))
})
