import { test, expect } from '@playwright/test';

// We use Playwright's official demo site for API Mocking
const DEMO_URL = 'https://demo.playwright.dev/api-mocking';

test.describe('高级前端特技：网络接口拦截与数据 Mock', () => {

  // 测试用例 1：拦截接口，强行返回空数据，测试前端的“空状态”UI
  test('Mock Empty Data: Should display empty state UI', async ({ page }) => {
    
    // 核心魔法：拦截所有发往 *api/v1/fruits 的网络请求
    await page.route('*/**/api/v1/fruits', async (route) => {
      // 不把请求发给真实的后端服务器，而是直接在这里伪造一个空的 JSON 响应
      const mockResponse = [];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockResponse),
      });
    });

    // 拦截规则设定好之后，再去打开页面
    await page.goto(DEMO_URL);

    // 断言：由于我们拦截了数据，前端应该没有渲染任何水果列表（列表为空）
    const fruitsList = page.locator('.fruit');
    await expect(fruitsList).toHaveCount(0);
    // 这里可以进一步断言页面上是否出现了“暂无数据”的提示文案
  });

  // 测试用例 2：伪造后端崩溃 (500 错误)，测试前端容错能力
  test('Mock 500 Error: Should handle server error gracefully', async ({ page }) => {
    
    // 拦截请求，强行塞给前端一个 500 Internal Server Error
    await page.route('*/**/api/v1/fruits', async (route) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ message: '服务器爆炸啦！' }),
      });
    });

    await page.goto(DEMO_URL);

    // 断言：前端没有因为接口报错而白屏，并且能获取不到数据
    const fruitsList = page.locator('.fruit');
    await expect(fruitsList).toHaveCount(0);
  });

  // 测试用例 3：篡改真实数据 (做个恶作剧)
  test('Modify Response: Intercept and change the actual data', async ({ page }) => {
    
    await page.route('*/**/api/v1/fruits', async (route) => {
      // 1. 先让请求真实发往服务器（拿回真正的数据）
      const response = await route.fetch();
      const json = await response.json();
      
      // 2. 拿到数据后，我们在中间做手脚！把第一个水果的名字强行改掉
      json.push({ name: '我是被测试脚本强行加进去的外星水果', id: 999 });

      // 3. 把篡改后的数据返回给前端浏览器
      await route.fulfill({
        response, // 继承原本的其他响应头
        status: 200,
        body: JSON.stringify(json),
      });
    });

    await page.goto(DEMO_URL);

    // 断言：页面上一定渲染出了我们刚才强行塞进去的那个假水果
    await expect(page.getByText('我是被测试脚本强行加进去的外星水果')).toBeVisible();
  });

});