import { test, expect } from '@playwright/test';

test('Mock Server Error / 模拟后端500报错', async ({ page }) => {
  // 1. 💡 修正点：在 goto 之前就设置路由，使用更强大的正则表达式
  // 拦截所有包含 "login" 的 POST 请求
  await page.route(/\/.*login.*/, async (route, request) => {
    if (request.method() === 'POST') {
      console.log(`📡 成功拦截请求: ${request.url()}`);
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Server is broken' }),
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('https://www.saucedemo.com/');

  // 2. 执行操作
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  
  // 3. 💡 技巧：点击后增加一个微小的等待，或者直接使用 expect 的自动重试
  await page.click('#login-button');

  // 4. 验证
  const errorMsg = page.locator('[data-test="error"]');
  
  // 💡 使用 soft assertion 即使失败也会继续执行，方便我们看日志
  await expect(errorMsg).toBeVisible({ timeout: 10000 }); 
  
  const text = await errorMsg.innerText();
  console.log('🔥 捕获到前端显示的错误信息:', text);
  
  // SauceDemo 报错时通常包含 "Epic sadface"
  expect(text).toContain('Epic sadface');
});