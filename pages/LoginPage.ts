import { Page, Locator } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  // Constructor: Initialize page element locators
  // 构造函数：初始化页面元素定位器
  constructor(page: Page) {
    this.page = page;

    // Use Playwright's Locator for element targeting (using 'data-test' attribute, a front-end best practice)
    // 使用 Playwright 的 Locator 定位元素（这里使用 data-test 属性，前端规范推荐写法）
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  // Action 1: Navigate to the target page
  // 动作 1：导航到目标页面
  async goto() {
    // 动态读取环境变量，如果没有配置则给个保底的 fallback
    const baseUrl = process.env.BASE_URL || "https://www.saucedemo.com/";
    await this.page.goto(baseUrl);
  }

  // Action 2: Perform the login operation
  // 动作 2：执行登录操作
  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
