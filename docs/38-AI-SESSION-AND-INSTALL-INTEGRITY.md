# AI 会话权限与安装副本完整性（2026-11-20 实测）

## 当前风险与处理

- 本机活动 DSH Desktop profile 的 `permission.defaultPreset` 原为 `danger-full-access`；抽查一条新会话的持久事件确为 `permission/preset=danger-full-access`、`sandbox/mode=danger-full-access`、`approval/policy=never`。工作台当前调用 `service.newSession(workspaceId)`，没有传入或核验专属权限。
- 已把本机活动 profile 的**新会话默认权限**改为 `read-only`，原文件备份在 `/private/tmp/testicular-dsh-permission-backup.yml`。此修改需 Harness 重新加载；既有会话的权限不会自动改变。开发会话如确需写入，应在独立 Git 源码工作区由用户显式切换权限。
- `read-only` 防止普通文件写入，但 DSH 官方沙箱说明其读取范围并不限制在工作区。它不能代替“只读获准患者资料”的数据访问隔离。要实现该目标，宿主还需要提供针对工作台会话的工具白名单或受限数据 API，并在会话创建时固定相应权限；当前工作台 `newSession` 接口没有这项可核验的能力。不得用提示词宣称已隔离。
- 安装包是运行产物，不是开发工作区。开发改动在 Git 仓库分支进行，测试、打包、安装后经 PR 回流；不能以 `node_modules` 内的改动作为 PR 原件。

## 本地安装完整性校验

`release/integrity.json` 固定当前可信 tar 包的 SHA-256。`npm run verify:installed` 先校验 tar 包摘要，再逐文件比对 DSH Desktop 活动 profile 中的安装副本，包括缺失、改动与多余文件；发现漂移以非零退出，不会覆盖用户数据或直接修改宿主状态。可用 `--archive`、`--installed`、`--sha256` 显式核对其他包，但必须从可信发布记录取得摘要。

本机 `.tgz` 按 `.gitignore` 不进入 Git；在另一台机器运行校验前，需要从可信安装来源取得对应版本的包，并先核对上述 SHA-256。

发现漂移时停止使用该工作台，从可信包通过 Desktop Plugin Manager 的受支持安装入口重新安装，再运行校验。若插件已导致启动失败，可用 Desktop 安全模式禁用该插件。禁止直接编辑安装副本、活动链接或 profile 状态文件来“修复”。

此校验是**外部检测工具**，尚未接入 Desktop 启动前的强制校验；工作台自身不能保护已经被改写的入口代码。面向所有 tar 包的强制保护需要宿主在加载插件前核对可信摘要，失败时阻止加载并提供受支持的恢复流程。

## 宿主级完成判据

1. 工作台创建患者对话时，由宿主绑定独立的只读/数据接口专用预设；不得暴露通用 shell、任意文件读取/写入或权限升级。新会话和旧会话的实际权限均能在 UI 中核对。
2. Plugin Manager 将安装来源与可信摘要记录在插件安装记录中；Harness 在加载每个包入口**之前**校验实际文件，发现改动、缺失或多余可执行文件就停用该包，并显示包名、版本与差异，不执行被改动的代码。
3. 用户选择恢复后，Plugin Manager 从可信来源按原安装契约重新安装并复核；患者数据库、配置和会话位于包外，恢复不覆盖这些数据。开发工作区只能从 Git 源码建分支并经 PR 回流。
