import { test } from '@playwright/test';
import { saveCoverage } from '../utils/coverage-util';

test('Collect JS Coverage / 收集前端代码覆盖率', async ({ page, browserName }) => {
  // 1. 检查浏览器类型，仅 Chromium 支持原生覆盖率收集
  const isChromium = browserName === 'chromium';

  if (isChromium) {
    await page.coverage.startJSCoverage();
  } else {
    console.log(`⚠️  Skipping coverage: ${browserName} does not support native JSCoverage.`);
  }

  // 2. 执行业务流程
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 3. 停止并保存
  if (isChromium) {
    const coverage = await page.coverage.stopJSCoverage();
    await saveCoverage(coverage);
    console.log('✅ 覆盖率原始数据已存入 ./coverage 目录');
  }
});