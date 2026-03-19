import { test, expect } from '@playwright/test';

test.describe('Phase 3: Hybrid Testing - API+UI混合测试', () => {

  // Inject both 'page' (UI) and 'request' (API) / 同时注入 page 和 request
  test('API data setup -> UI validation / API 造数据 -> UI 验证', async ({ page, request }) => {
    
    // 1. Setup data via API / 用极其稳定的公共 API 创建前置数据
    const apiResponse = await request.post('https://jsonplaceholder.typicode.com/posts', {
      data: {
        title: 'SDET',
        body: 'Playwright is awesome',
        userId: 1,
      }
    });
    
    // Assert API success (201 Created) and extract ID / 断言接口成功(201)并提取 ID
    expect(apiResponse.status()).toBe(201);
    const newPostId = (await apiResponse.json()).id;
    console.log(`\n API data created! Post ID / API 造数成功！获取到的 ID: ${newPostId}\n`);

    // 2. Verify via UI / 用 UI 验证渲染结果
    // Navigate to example.com just to simulate UI interaction / 跳转测试页面模拟 UI 交互
    await page.goto('https://example.com');
    await expect(page.locator('h1')).toBeVisible();
  });

});