import { test, expect } from '@playwright/test';

test.describe('Phase 4: Visual Regression - 阶段四：视觉回归测试', () => {
  
  test('UI pixel-perfect comparison / UI 像素级比对', async ({ page }) => {
    // 1. Navigate to target page / 打开目标页面 (利用之前的 Global Setup, 这里已自带登录态)
    await page.goto('https://www.saucedemo.com/inventory.html');

    // 2. Wait for network to be idle / 等待页面所有网络请求加载完毕
    await page.waitForLoadState('networkidle');

    // 3. Take screenshot and compare / 截图并与基准图(Baseline)比对
    // maxDiffPixelRatio: 1% tolerance for rendering variations / 允许 1% 的微小像素渲染误差
    await expect(page).toHaveScreenshot('inventory-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01 
    });
  });

});