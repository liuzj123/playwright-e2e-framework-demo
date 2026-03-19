import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

// Define the path where the authentication state will be saved
// 定义保存鉴权状态的文件路径
const authFile = '.auth/user.json';

setup('Global Authentication Setup - 全局鉴权登录', async ({ page }) => {
  const loginPage = new LoginPage(page);
  
  // 1. Navigate and perform the UI login
  // 1. 打开页面并执行 UI 登录
  await loginPage.goto();
  await loginPage.login('standard_user', 'secret_sauce');

  // 2. Wait for the page to load to ensure cookies/tokens are set
  // 2. 等待页面跳转成功，确保 Cookie/Token 已经成功写入浏览器
  await expect(page).toHaveURL(/.*inventory.html/);

  // 3. Save the storage state (Cookies, LocalStorage) to the file
  // 3. 核心魔法：把当前浏览器的存储状态（Cookies等）保存到本地 JSON 文件中
  await page.context().storageState({ path: authFile });
});