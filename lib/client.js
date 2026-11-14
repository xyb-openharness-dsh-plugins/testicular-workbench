window.__ModuleLoader__.load({
  id: "@xyb-community/testicular-workbench",
  factory(require) {
    const React = require('react')
    const h = React.createElement
    const META = {"title":"睾丸癌患者工作台","description":"本机优先的睾丸癌（生殖细胞肿瘤）术后标志物、监测节点、生育力保存与就诊准备记录工作台"}
    const theme = "/* Scope to business content; never style host navigation globally. */\n.wb-testicular {\n  --wb-paper: #f7faf8; --wb-surface: #ffffff; --wb-ink: #34413c;\n  --wb-muted: #596c62; --wb-line: #dce7df; --wb-mint: #e2f2ea;\n  --wb-mint-ink: #22664e; --wb-action: #b95023; --wb-action-ink: #ffffff;\n  --wb-pink: #f8e8eb; --wb-blue: #eaf1f6; --wb-yellow: #faf2d8;\n  --wb-radius: 18px; --wb-gap: 16px; --wb-group-gap: 24px;\n  color: var(--wb-ink); background: var(--wb-paper); font: 16px/1.65 -apple-system,BlinkMacSystemFont,\"PingFang SC\",\"Microsoft YaHei\",sans-serif;\n  font-variant-numeric: tabular-nums; min-width: 0; min-height: 0; container-type: inline-size;\n}\n.wb-testicular[data-font=large] { font-size: 19px; }\n.wb-testicular * { box-sizing: border-box; }\n.wb-testicular button,.wb-testicular input,.wb-testicular select { font: inherit; }\n.wb-testicular button { min-height: 44px; cursor: pointer; }\n.wb-testicular :focus-visible { outline: 3px solid var(--wb-mint-ink); outline-offset: 3px; }\n.wb-testicular .wb-primary { background: var(--wb-action); color: var(--wb-action-ink); border: 0; border-radius: 999px; padding: 9px 20px; }\n.wb-testicular .wb-flower { display: inline-block; width: 24px; height: 24px; flex: 0 0 auto; margin-inline-end: 10px; animation: wb-flower-turn 12s linear infinite; }\n@keyframes wb-flower-turn { to { transform: rotate(360deg); } }\n@media (prefers-color-scheme: dark) {\n  .wb-testicular { --wb-paper:#17231f; --wb-surface:#20322a; --wb-ink:#edf5ef; --wb-muted:#c0d2c6; --wb-line:#496354; --wb-mint:#294f3f; --wb-mint-ink:#a0ddbd; --wb-action:#f3a578; --wb-action-ink:#39200e; --wb-pink:#45333a; --wb-blue:#283d4c; --wb-yellow:#473e25; }\n}\n@media (prefers-reduced-motion: reduce) {\n  .wb-testicular .wb-flower { animation:none; }\n}\n"

    /* ---- 原生 AI 对话面板：宽度与草稿常量（家族同一契约） ----
     * 为什么骨架就带这套接线：check-agent-pane-contract 是 init check 链的一员，
     * 骨架若不接线，新仓第一天基线必红（2026-11-12 cidp-workbench 夜班实测，
     * 回流见 docs/LESSONS.md L90）。这里是与家族仓同一套判定：会话归属看
     * service.ownsSession / currentSession，不用 conversation prop 的真值判断
     * （customFrame 下宿主恒传一个隐藏的 conversation 容器，真值判断必误判）。 */
    const AGENT_MIN = 0.25
    const AGENT_MAX = 0.45
    const AGENT_DEFAULT = 0.35
    const AGENT_STEP = 0.02
    const NARROW_BELOW = 900
    const DRAWER_MAX = 420
    const WIDTH_KEY = 'testicular.agentWidth'
    const DRAFT_KEY = 'testicular.agentDraft'
    const NO_SESSION_CAPABILITY_NOTE = '宿主没有提供会话创建能力（service.newSession 不可用），AI 对话暂时打不开。'

    /* ---- 资料目录口径（与 dsh 服务端 checkDataDir 同一条规则，服务端会再判一遍） ----
     * 主目录本身 / 桌面 / 下载根目录 / tmp 一律拒绝；请在里面新建专用文件夹再选。 */
    const DATA_ROOT_URL = '/api/testicular/api/root'
    const HOME_EXACT = /^(\/Users\/[^/]+|\/home\/[^/]+|\/root|[A-Za-z]:\\Users\\[^\\]+)$/i
    const FORBIDDEN_DIR = /((Desktop|桌面)$|(Downloads?|下载(夹)?)$|^(\/tmp|\/private\/tmp|\/var\/folders\/|\/private\/var\/folders\/))/i
    const isForbiddenDir = (dir) => HOME_EXACT.test(dir) || FORBIDDEN_DIR.test(dir)

    function loadWidth() {
      try {
        const saved = Number(localStorage.getItem(WIDTH_KEY))
        if (Number.isFinite(saved) && saved >= AGENT_MIN && saved <= AGENT_MAX) return saved
      } catch { /* 隐私模式忽略 */ }
      return AGENT_DEFAULT
    }
    function saveWidth(value) {
      try { localStorage.setItem(WIDTH_KEY, String(value)) } catch { /* 隐私模式忽略 */ }
    }
    const round4 = (n) => Math.round(n * 10000) / 10000
    const snapWidth = (n) => Math.min(AGENT_MAX, Math.max(AGENT_MIN, n))

    function buildPanel(React, host) {
      const { useState, useEffect, useRef } = React
      const service = host?.desktopWorkbenches

      /* ---------------- 会话归属（与家族各仓同一套判定） ---------------- */

      function currentSession() {
        if (typeof service?.currentSession === 'function') return service.currentSession() || null
        const snapshot = host?.sessions?.list?.getSnapshot?.()
        return snapshot?.current || Object.keys(snapshot?.byId || {}).find((id) =>
          (snapshot.byId[id]?.retainedBy?.mainView ?? 0) > 0) || null
      }
      function workbenchOwnsSession(sessionId) {
        if (!sessionId) return false
        return typeof service?.ownsSession === 'function' ? Boolean(service.ownsSession(sessionId)) : false
      }
      function ownedSession() {
        const id = currentSession()
        return workbenchOwnsSession(id) ? id : null
      }

      /* ---------------- 原生草稿：只填不发 ---------------- */

      function appendDraft(sessionId, prompt) {
        if (!sessionId || ownedSession() !== sessionId) throw new Error('会话已切换，请回到本工作台再操作')
        const scoped = host.sessions.scope?.(sessionId)
        const conversation = scoped?.get?.('conversation')
        if (!conversation) throw new Error('对话输入不可用')
        const input = conversation.input.for(scoped)
        const snapshot = input.state.getSnapshot()
        if (snapshot.occurrences?.length || (snapshot.phase && snapshot.phase !== 'plain')) {
          throw new Error('当前草稿含引用或正在提交，请先在原生会话里处理')
        }
        const current = snapshot.draft || ''
        input.setDraft(current.trim() ? `${current}\n\n${prompt}` : prompt)
      }

      let pendingDraft = null
      try {
        const saved = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null')
        if (saved?.sessionId && saved?.prompt) pendingDraft = saved
      } catch { /* 隐私模式忽略 */ }
      function rememberDraft(entry) {
        pendingDraft = entry
        try {
          if (entry) localStorage.setItem(DRAFT_KEY, JSON.stringify(entry))
          else localStorage.removeItem(DRAFT_KEY)
        } catch { /* 隐私模式忽略 */ }
      }
      function flushDraft() {
        if (!pendingDraft) return false
        try {
          appendDraft(pendingDraft.sessionId, pendingDraft.prompt)
          rememberDraft(null)
          return true
        } catch { return false /* composer 未就绪：留到下一轮 */ }
      }

      function onboardingPrompt() {
        return [
          `你正在协助我使用「${META.title}」。它只整理本机资料，不做诊断、不给处置建议、不做病情判定。`,
          '里面是我自己记录的病程与检查经过；分工：你帮我汇总已记录的内容、指出缺项；判断和处置由我和我的医生决定。',
          '没有记录的项请写"没有"，不要补写或推测；标了私密的内容不要复述。',
        ].join('\n')
      }

      /* ---------------- 样式（骨架阶段内联；M5 移植 public 主题） ---------------- */

      const rootStyle = { flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, background: 'var(--wb-paper, #f7faf8)' }
      const headerStyle = {
        display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', padding: '10px 16px',
        borderBottom: '1px solid var(--wb-line, #dce7df)', minHeight: 38,
        paddingInlineStart: 'var(--dsh-frame-leading-clearance, 0px)',
      }
      const hintStyle = { marginLeft: 'auto', color: 'var(--wb-muted, #596c62)', fontSize: 12.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
      const bodyStyle = { position: 'relative', flex: 1, display: 'flex', minHeight: 0, overflow: 'hidden' }
      const businessStyle = { flex: '1 1 auto', minWidth: 0, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16, padding: 20 }
      const paneStyle = {
        position: 'relative', flex: '0 0 auto', display: 'flex', flexDirection: 'column',
        minHeight: 0, overflow: 'hidden', background: 'var(--wb-surface, #fff)', borderLeft: '1px solid var(--wb-line, #dce7df)',
      }
      const drawerStyle = { position: 'absolute', inset: '0 0 0 auto', borderLeft: '1px solid var(--wb-line, #dce7df)', boxShadow: '-8px 0 24px rgba(0,0,0,0.14)' }
      const splitterStyle = {
        position: 'absolute', top: 0, bottom: 0, width: 1, marginRight: -0.5,
        zIndex: 2, background: 'var(--wb-line, #dce7df)', cursor: 'col-resize', touchAction: 'none',
      }
      const splitterHoverStyle = { ...splitterStyle, background: 'var(--wb-action, #b95023)', boxShadow: '0 0 6px rgba(185,80,35,0.55)' }
      const splitterDragStyle = { ...splitterHoverStyle, boxShadow: '0 0 10px rgba(185,80,35,0.8)' }
      const splitterHitStyle = { position: 'absolute', top: 0, bottom: 0, left: -5, width: 11, background: 'transparent', cursor: 'col-resize' }
      const dragShieldStyle = { position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, zIndex: 4, cursor: 'col-resize', background: 'transparent', touchAction: 'none' }
      const buttonStyle = { minHeight: 30, border: 0, borderRadius: 999, padding: '5px 12px', whiteSpace: 'nowrap', background: 'var(--wb-action, #b95023)', color: 'var(--wb-action-ink, #fff)', font: 'inherit', fontWeight: 600, cursor: 'pointer' }
      const ghostStyle = { ...buttonStyle, background: 'transparent', color: 'var(--wb-action, #b95023)', border: '1px solid var(--wb-line, #dce7df)' }
      const padStyle = { display: 'flex', flexDirection: 'column', gap: 8, justifyContent: 'center', padding: 20, color: 'var(--wb-muted, #596c62)', fontSize: 12.5, lineHeight: 1.75 }
      const cardStyle = { background: 'var(--wb-surface, #fff)', border: '1px solid var(--wb-line, #dce7df)', borderRadius: 'var(--wb-radius, 18px)', padding: 20 }

      return function Panel({ conversation }) {
        const [health, setHealth] = useState(null)
        const [error, setError] = useState('')
        const [large, setLarge] = useState(false)
        const [attempt, setAttempt] = useState(0)
        const [width, setWidth] = useState(loadWidth)
        const [paneOpen, setPaneOpen] = useState(true)
        const [connecting, setConnecting] = useState(false)
        const [narrow, setNarrow] = useState(false)
        const [dragging, setDragging] = useState(false)
        const [hovering, setHovering] = useState(false)
        const [note, setNote] = useState('')
        const [dataDir, setDataDir] = useState('')
        const [, setSessionRevision] = useState(0)

        const dragHostRef = useRef(null)
        const frameRef = useRef(null)
        const creatingRef = useRef(false)

        /* customFrame 下宿主始终传 conversation 容器；无会话时只是 display:none。
           用归属服务判断当前工作台是否真的有会话，不能用 prop 是否为真值。 */
        const activeSession = ownedSession()
        const hasConversation = Boolean(activeSession)
        const canOpenSession = typeof service?.newSession === 'function'

        useEffect(() => {
          setError('')
          const controller = new AbortController()
          fetch('/api/testicular/health', { signal: controller.signal, credentials: 'same-origin' })
            .then(async (response) => {
              if (!response.ok) throw new Error(`服务连接失败 (${response.status})`)
              const result = await response.json()
              if (!controller.signal.aborted) setHealth(result)
            })
            .catch((failure) => { if (!controller.signal.aborted) setError(failure.message) })
          return () => controller.abort()
        }, [attempt])

        /* 当前资料目录：开面板读一次；换过之后立即回显（读不到就不显示，不编路径） */
        useEffect(() => {
          let alive = true
          fetch(DATA_ROOT_URL, { credentials: 'same-origin' })
            .then((response) => (response.ok ? response.json() : null))
            .then((info) => { if (alive && info && info.dir) setDataDir(info.dir) })
            .catch(() => { /* 服务未就绪时静默，不编一个假路径 */ })
          return () => { alive = false }
        }, [])

        /* 「资料目录」= 真入口：宿主选择器 → 口径校验 → 落盘 → 回显 */
        async function pickDataDir() {
          const ui = host && host.uiWorkspace
          if (!ui || typeof ui.pickDirectory !== 'function') {
            setNote('当前 Desktop 没有提供目录选择能力；数据仍写在默认位置（目录未真实挂载）。')
            return
          }
          let dir = ''
          try { dir = await ui.pickDirectory() } catch (error) {
            setNote('没能打开目录选择器：' + ((error && error.message) || error))
            return
          }
          if (!dir) { setNote('已取消选择目录；当前资料目录没有更改。'); return }
          if (isForbiddenDir(dir)) {
            setNote('这个位置不能当资料目录（主目录本身 / 桌面 / 下载根目录 / tmp）。请在里面新建一个专用文件夹再选。')
            return
          }
          try {
            const response = await fetch(DATA_ROOT_URL, {
              method: 'POST', credentials: 'same-origin',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ dir }),
            })
            const body = await response.json().catch(() => ({}))
            if (!response.ok) { setNote(body.error || '目录切换失败'); return }
            setDataDir(body.dir || dir)
            setNote('资料目录已切换到：' + (body.dir || dir) + '（旧目录数据不会自动搬迁）')
          } catch (error) {
            setNote('目录切换失败：' + ((error && error.message) || error))
          }
        }

        // 挂载后消化未送达的草稿（composer 就绪一轮一次），并订阅会话变化触发重渲染。
        useEffect(() => {
          const interval = setInterval(() => { if (flushDraft()) setNote('草稿已填入会话，按回车发送') }, 500)
          const unsubscribe = service?.subscribe?.(() => {
            setSessionRevision((revision) => revision + 1)
            setNote('')
          })
          return () => { clearInterval(interval); unsubscribe?.() }
        }, [])

        // 窄屏判定用容器宽度而不是窗口宽度：宿主主区宽度不等于窗口宽度。
        useEffect(() => {
          const node = dragHostRef.current
          if (!node || typeof ResizeObserver !== 'function') return undefined
          const observer = new ResizeObserver((entries) => {
            const w = entries[0]?.contentRect?.width ?? 0
            setNarrow(w > 0 && w < NARROW_BELOW)
          })
          observer.observe(node)
          return () => observer.disconnect()
        }, [])

        const applyWidth = (next) => {
          const snapped = round4(snapWidth(next))
          setWidth(snapped)
          saveWidth(snapped)
        }
        const stopDrag = () => { dragHostRef.current = null; setDragging(false) }

        useEffect(() => {
          if (!dragging) return undefined
          const onMove = (event) => {
            const rect = dragHostRef.current?.getBoundingClientRect?.()
            if (!rect?.width) return
            applyWidth((rect.right - event.clientX) / rect.width)
          }
          document.addEventListener('pointermove', onMove)
          document.addEventListener('pointerup', stopDrag)
          document.addEventListener('pointercancel', stopDrag)
          return () => {
            document.removeEventListener('pointermove', onMove)
            document.removeEventListener('pointerup', stopDrag)
            document.removeEventListener('pointercancel', stopDrag)
          }
        }, [dragging])

        const onSplitterPointerDown = (event) => {
          event.preventDefault()
          try { event.currentTarget.setPointerCapture(event.pointerId) } catch { /* 旧宿主无指针捕获 */ }
          dragHostRef.current = dragHostRef.current || event.currentTarget.parentElement
          setDragging(true)
        }
        const onSplitterKeyDown = (event) => {
          const delta = { ArrowLeft: AGENT_STEP, ArrowRight: -AGENT_STEP }[event.key]
          if (delta !== undefined) { event.preventDefault(); applyWidth(width + delta); return }
          if (event.key === 'Home') { event.preventDefault(); applyWidth(AGENT_MAX); return }
          if (event.key === 'End') { event.preventDefault(); applyWidth(AGENT_MIN) }
        }

        /* ---- 打开 / 复用 AI 会话（不自动发送） ---- */

        async function openAgent(prompt = null) {
          setNote('')
          if (!canOpenSession) { setNote(NO_SESSION_CAPABILITY_NOTE); return }
          const existing = ownedSession()
          if (existing) {
            setPaneOpen(true)
            if (prompt) {
              rememberDraft({ sessionId: existing, prompt })
              setNote(flushDraft() ? '已填入会话草稿，按回车发送' : '会话输入框还没就绪；内容已暂存')
            }
            return
          }
          // 快速连点时不并发创建出两条会话。
          if (creatingRef.current) return
          creatingRef.current = true
          setConnecting(true)
          try {
            // 优先用宿主默认工作区；没有可用工作区时把 undefined 交给宿主，
            // 由宿主按它的流程提示选择资料目录，并负责创建、绑定和激活会话。
            let workspaceId
            try { workspaceId = service.defaultWorkspace?.()?.workspaceId } catch { workspaceId = undefined }
            const id = await service.newSession(workspaceId)
            if (!id) {
              setNote('已取消资料目录选择，没有创建会话。可以再次点击「AI 对话」重试。')
              return
            }
            setPaneOpen(true)
            rememberDraft({ sessionId: id, prompt: prompt || onboardingPrompt() })
            setNote(flushDraft()
              ? '会话已就绪：草稿已填入右侧输入框，按回车发送'
              : '会话已就绪；输入框就绪后草稿会自动填入')
          } catch (error) {
            setNote(`没能调起会话：${error?.message ?? error}。可以再次点击「AI 对话」重试。`)
          } finally {
            creatingRef.current = false
            setConnecting(false)
          }
        }

        function onAgentClick() {
          if (!hasConversation) { void openAgent(); return }
          setPaneOpen((open) => !open)
          setNote('')
        }

        async function deliverContext(prompt) {
          const id = ownedSession()
          if (id) {
            setPaneOpen(true)
            rememberDraft({ sessionId: id, prompt })
            setNote(flushDraft() ? '已填入会话草稿，按回车发送' : '会话输入框还没就绪；内容已暂存')
            return
          }
          await openAgent(prompt)
        }

        // 业务页只认「自己 + 同源」发来的消息；handler 每轮换最新闭包，effect 只注册一次。
        const deliverRef = useRef(null)
        deliverRef.current = deliverContext
        useEffect(() => {
          function onMessage(event) {
            const data = event.data
            if (!data || typeof data !== 'object') return
            if (frameRef.current && event.source !== frameRef.current.contentWindow) return
            if (event.origin !== window.location.origin) return
            if (data.type === 'testicular:agent-open') { void openAgent(); return }
            if (data.type !== 'testicular:agent-draft') return
            const prompt = typeof data.prompt === 'string' ? data.prompt.trim() : ''
            if (prompt) void deliverRef.current?.(prompt.slice(0, 8000))
          }
          window.addEventListener('message', onMessage)
          return () => window.removeEventListener('message', onMessage)
        }, [])

        const agentLabel = !canOpenSession
          ? 'AI 对话暂不可用'
          : connecting ? '正在连接…'
            : !hasConversation ? 'AI 对话'
              : paneOpen ? '收起 AI 对话' : '打开 AI 对话'
        // 能力缺失时的说明不能被会话订阅回调里的 setNote('') 冲掉：渲染期兜一层。
        const shownNote = note || (canOpenSession ? '' : NO_SESSION_CAPABILITY_NOTE)

        const percent = Math.round(width * 100)
        const paneVisible = paneOpen && (hasConversation || connecting)

        return h('main', { className: 'wb-testicular', 'data-font': large ? 'large' : 'standard', style: rootStyle },
          // 首个子元素必须是语义 <header>：避让 macOS 窗口按钮（--dsh-frame-leading-clearance）。
          h('header', { style: headerStyle },
            h('strong', null, META.title),
            h('span', { 'aria-live': 'polite' }, health ? `v${health.version}` : '连接中'),
            h('button', { type: 'button', 'aria-pressed': large, onClick: () => setLarge(!large) }, large ? '标准字' : '大字'),
            h('button', {
              type: 'button',
              style: ghostStyle,
              onClick: () => void pickDataDir(),
              title: dataDir ? ('当前资料目录：' + dataDir) : '选择本机资料目录（拒绝主目录/桌面/下载根/tmp）',
              'aria-label': '选择资料目录',
            }, '资料目录'),
            h('span', { style: hintStyle, title: shownNote || '界面由业务区提供' },
              shownNote || '本机数据 · 仅回顾不解读'),
            h('button', {
              type: 'button',
              style: buttonStyle,
              onClick: onAgentClick,
              disabled: connecting || (!hasConversation && !canOpenSession),
              'aria-label': `AI 对话：${agentLabel}`,
            }, agentLabel),
            hasConversation && paneOpen && h('button', {
              type: 'button', style: ghostStyle, onClick: () => setPaneOpen(false),
              'aria-label': '收起 AI 对话面板',
            }, '×')),
          h('style', null, theme),
          h('div', { ref: dragHostRef, style: bodyStyle },
            h('div', { style: businessStyle },
              h('section', { style: cardStyle },
                h('h1', { style: { fontSize: '1.6em', margin: '0 0 12px' } }, META.title),
                h('p', null, META.description),
                h('p', { role: 'status' }, error || (health ? '接入骨架：服务已连接，业务功能待按 spec 实现。' : '正在连接本机服务…')),
                h('p', { style: { fontSize: '0.9em', color: 'var(--wb-muted, #596c62)' } },
                  '规划中的临床试验线按 35 号四段链路实现（M2/M5 交付，本骨架页不含检索入口）：①建档（只有已确认入库的档案字段参与匹配）→ ②检索（关键词/病理/状态/阶段，按所选条件排序）→ ③匹配（登记字段符合度 + 四档分层 + 待确认证据链）→ ④呈现与收藏（saved_trial 收藏跟踪）。'),
                h('button', { type: 'button', className: 'wb-primary', onClick: () => setAttempt((value) => value + 1) }, '重新检查连接'))),
            // 分隔线夹在业务区与会话之间；骨架阶段的业务区无 iframe，frameRef 留给 M5。
            !narrow && paneVisible && h('div', {
              role: 'separator',
              'aria-orientation': 'vertical',
              'aria-label': '调整 AI 对话面板宽度',
              'aria-valuemin': Math.round(AGENT_MIN * 100),
              'aria-valuemax': Math.round(AGENT_MAX * 100),
              'aria-valuenow': percent,
              tabIndex: 0,
              style: {
                ...(dragging ? splitterDragStyle : hovering ? splitterHoverStyle : splitterStyle),
                right: `${percent}%`,
              },
              onPointerDown: onSplitterPointerDown,
              onPointerEnter: () => setHovering(true),
              onPointerLeave: () => setHovering(false),
              onKeyDown: onSplitterKeyDown,
            },
              h('span', { style: splitterHitStyle, 'aria-hidden': 'true' })),
            // 原生会话始终挂载：隐藏走 display，不卸载（否则丢输入框与草稿状态）。
            h('aside', {
              style: {
                ...paneStyle,
                ...(narrow ? drawerStyle : null),
                width: narrow ? `min(92%, ${DRAWER_MAX}px)` : `${percent}%`,
                display: paneVisible ? 'flex' : 'none',
              },
              'aria-label': 'AI 对话',
              'aria-hidden': paneVisible ? undefined : 'true',
            }, hasConversation && conversation ? conversation : h('div', { style: padStyle },
              h('b', null, connecting ? '正在准备 AI 对话' : 'AI 对话还没开始'),
              h('span', null, connecting
                ? '宿主正在恢复会话或等待你选择资料目录。'
                : '点顶栏「AI 对话」创建或打开本工作台的原生会话。'),
              h('span', null, '没有会话也不影响记录：业务区的资料整理照常可用。'))),
            dragging && !narrow && h('div', { 'aria-hidden': 'true', style: dragShieldStyle })))
      }
    }

    function apply(ctx) {
      const Panel = buildPanel(React, ctx)
      ctx.effect(() => ctx.desktopWorkbenches.register({"title":"睾丸癌患者工作台","repository":"https://github.com/xyb-openharness-dsh-plugins/testicular-workbench","description":"本机优先的睾丸癌（生殖细胞肿瘤）术后标志物、监测节点、生育力保存与就诊准备记录工作台","customFrame":true}, Panel))
    }
    return { apply, inject: ['desktopWorkbenches'] }
  }
})
