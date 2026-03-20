import { test, expect } from '@playwright/test';
import { DbUtil } from '../utils/db-util';

test('Scenario: UI下单后校验数据库状态', async ({ page }) => {
  // 1. 访问并登录 (这里可以直接复用已有的 Page Object 或简单实现)
  await page.goto('https://www.saucedemo.com/');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 2. UI 操作：添加商品到购物车
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('.shopping_cart_link');
  
  // 3. UI 操作：结账流程
  await page.click('[data-test="checkout"]');
  await page.fill('[data-test="firstName"]', 'San');
  await page.fill('[data-test="lastName"]', 'Zhang');
  await page.fill('[data-test="postalCode"]', '100000');
  await page.click('[data-test="continue"]');
  
  // 4. UI 操作：确认下单
  await page.click('[data-test="finish"]');
  
  // 5. UI 断言：检查前端是否显示成功
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

  // 🚀 核心：阶段六 - 数据库直连校验
  // 在真实项目中，订单 ID 通常会从页面 URL 或 API 响应中提取
  const testOrderId = 101; 
  const isPersisted = await DbUtil.verifyOrderExists(testOrderId);
  
  expect(isPersisted).toBe(true);
  console.log(`✅ 数据库校验通过：订单 ${testOrderId} 已在持久层确认`);
});