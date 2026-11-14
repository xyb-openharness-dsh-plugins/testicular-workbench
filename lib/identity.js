/**
 * 身份常量：插件 id、API 前缀、数据根目录名、UI 入口（家族口径，睾丸癌版）。
 * `id` 必须与 cordis.patch.yml 的 insert id 一致（testicular-main）。
 * API_PREFIX 是宿主挂载前缀；宿主里 API_BASE='/api/testicular'，页面拼 `${API_BASE}/api/bootstrap`。
 * 守卫只禁「交界处重复 /api」，不许 includes('/api') 一刀切（家族踩 4）。
 */
export const PLUGIN_ID = 'testicular-main';
export const PACKAGE_NAME = '@xyb-community/testicular-workbench';
export const API_PREFIX = 'testicular';
export const HOME_DIR = 'testicular';
export const DB_FILE = 'testicular-workbench.sqlite';
export const UI_ENTRY = 'index.html';
export const DEV_PORT = 7797;
