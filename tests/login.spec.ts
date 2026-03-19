import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
// 引入我们的测试数据
import usersData from '../data/users.json';

test.describe('Swag Labs 登录模块测试 (DDT)', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    test.setTimeout(80000);
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  // 神级操作：遍历 JSON 数组，动态生成测试用例！
  // 面试官看到这里绝对会疯狂点头
  for (const user of usersData) {
    test(`数据驱动测试: ${user.caseName}`, async ({ page }) => {
      
      // 执行登录动作（数据从 JSON 里取）
      await loginPage.login(user.username, user.password);

      // 根据数据中的 isValid 字段，走不同的断言逻辑
      if (user.isValid) {
        // 如果是有效账号，断言页面跳转成功
        await expect(page).toHaveURL(new RegExp(`.*${user.expectedUrl}`));
      } else {
        // 如果是无效账号，断言报错信息出现，且文案与 JSON 中一致
        await expect(loginPage.errorMessage).toBeVisible();
        await expect(loginPage.errorMessage).toContainText(user.errorMessage!);
      }
    });
  }
});