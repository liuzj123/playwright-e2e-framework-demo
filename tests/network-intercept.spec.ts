import { test, expect } from '@playwright/test';

test('Real Mock: Intercept genuine API call / 真实拦截：处理外部接口', async ({ page }) => {
  // 1. 拦截一个真实的外部请求
  await page.route('**/posts/1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ title: 'MOCK_TITLE', body: 'MOCK_CONTENT' }),
    });
  });

  // 2. 在页面中触发这个请求（我们手动注入一个 fetch 模拟业务场景）
  await page.goto('https://www.saucedemo.com/');
  const data = await page.evaluate(async () => {
    const res = await fetch('https://jsonplaceholder.typicode.com/posts/1');
    return res.json();
  });

  // 3. 验证数据是否被成功篡改
  console.log('📦 Mocked Data:', data);
  expect(data.title).toBe('MOCK_TITLE');
});