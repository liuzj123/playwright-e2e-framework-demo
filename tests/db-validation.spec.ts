import { test, expect } from '@playwright/test';
import { DbUtil } from '../utils/db-util';

test('Scenario: UI下单后校验数据库状态', async ({ page }) => {
  await page.goto('https://www.saucedemo.com/');
  // ... 模拟一系列 UI 下单操作 ...

  // 关键：直接调库校验
  const isPersisted = await DbUtil.verifyOrderExists(101);
  expect(isPersisted).toBe(true);
  console.log('✅ 数据库校验通过：订单已正确入库');
});