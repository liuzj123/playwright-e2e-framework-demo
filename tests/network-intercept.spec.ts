import { test, expect } from '@playwright/test';

test('Intercept and Verify API Request / 拦截并校验底层接口请求', async ({ page }) => {
  // 1. 设置监听器：当页面发出特定 URL 的请求时触发
  const requestPromise = page.waitForRequest(request => 
    request.url().includes('/v1/login') && request.method() === 'POST'
  );

  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 2. 获取拦截到的请求对象
  const request = await requestPromise;

  // 3. 校验请求体 (Payload) —— 判定前端是否传错参数
  const postData = JSON.parse(request.postData() || '{}');
  console.log('📡 Intercepted Payload:', postData);
  
  expect(postData.username).toBe('standard_user');
});

test('Mock Server Error / 模拟后端500报错', async ({ page }) => {
    // 拦截所有指向 login 的请求，直接返回 500
    await page.route('**/login', route => route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal Server Error' }),
    }));
  
    await page.goto('https://www.saucedemo.com/');
    // ... 输入账号密码并登录 ...
    
    // 验证前端是否处理了异常情况（比如弹出了红色的错误提示）
    const errorMsg = page.locator('[data-test="error"]');
    await expect(errorMsg).toBeVisible();
  });