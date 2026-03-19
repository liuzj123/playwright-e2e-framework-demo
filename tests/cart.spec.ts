import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

// test.describe groups our E2E shopping flow tests
// test.describe 将我们的端到端购物流程测试分组
test.describe('Swag Labs E2E Shopping Flow', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  // Hook: Before each test, login as a standard user
  // 钩子函数：每次测试前，先执行标准的登录流程
  test.beforeEach(async ({ page }) => {
    inventoryPage = new InventoryPage(page);
    
    await page.goto('https://www.saucedemo.com/inventory.html')
  });

  // Test Case: Add an item to the cart and verify the cart badge updates
  // 测试用例：添加商品到购物车，并验证购物车角标更新
  test('should update shopping cart badge when item is added', async () => {
    // Action: Add the Backpack to the cart
    // 动作：将“Sauce Labs Backpack”加入购物车
    await inventoryPage.addToCart('Sauce Labs Backpack');
    
    // Assertion: Verify the cart badge is visible and shows '1'
    // 断言：验证购物车角标可见，并且数字变为 '1'
    await expect(inventoryPage.shoppingCartBadge).toBeVisible();
    await expect(inventoryPage.shoppingCartBadge).toHaveText('1');

    // Action: Add another item (Fleece Jacket)
    // 动作：再添加一件商品（抓绒外套）
    await inventoryPage.addToCart('Sauce Labs Fleece Jacket');

    // Assertion: Verify the cart badge updates to '2'
    // 断言：验证购物车角标数字更新为 '2'
    await expect(inventoryPage.shoppingCartBadge).toHaveText('2');
  });
});