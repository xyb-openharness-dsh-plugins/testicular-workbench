import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { checkDataDir } from '../dsh/server.js';

/* checkDataDir 是纯字符串判定：临时目录只用来取一个真实存在的拒绝样本（macOS tmpdir
   形如 /var/folders/...），全程不写用户数据。 */

test('checkDataDir 反例：主目录/桌面/下载/tmp/相对路径/空串全部拒绝', () => {
  const realTmp = tmpdir();
  const bad = [
    ['', '空目录'],
    ['相对/路径', '相对路径'],
    ['/Users/alice', '主目录本身'],
    ['C:\\Users\\alice', 'Windows 主目录本身'],
    ['/root', 'root 主目录'],
    ['/Users/alice/Desktop', '桌面根'],
    ['/Users/alice/桌面', '桌面根（中文）'],
    ['/Users/alice/Downloads', '下载根'],
    ['/Users/alice/下载夹', '下载根（中文）'],
    ['/tmp', 'tmp 根'],
    ['/private/tmp', 'private tmp'],
    [realTmp, '真实系统 tmp'],
  ];
  for (const [dir, label] of bad) {
    const verdict = checkDataDir(dir);
    assert.equal(verdict.ok, false, `${label} 不应通过：${dir}`);
    assert.ok(verdict.reason, `${label} 拒绝时缺可读原因`);
  }
});

test('checkDataDir 正例：用户目录下的专用子目录通过（含桌面下子目录）', () => {
  const good = [
    '/Users/alice/testicular-data',
    '/Users/alice/Desktop/testicular-data', /* 桌面下的专用子目录不是桌面本身 */
    '/Users/alice/Documents/workbench/记录',
  ];
  for (const dir of good) {
    const verdict = checkDataDir(dir);
    assert.equal(verdict.ok, true, `子目录应通过：${dir}（原因：${verdict.reason || ''}）`);
    assert.equal(verdict.dir, dir);
  }
  const base = mkdtempSync(join(tmpdir(), 'twb-dir-'));
  assert.ok(base.startsWith(tmpdir()), '前置自检：临时目录在系统 tmp 下');
});
