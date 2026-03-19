import { test } from '@playwright/test';
import { injectAxe, checkA11y } from 'axe-playwright';

test.describe('Phase 9: A11y - 阶段九：无障碍', () => {
  test('A11y scan with soft assertion / 无障碍扫描(软断言)', async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
    await injectAxe(page);

    // 💡 技巧：使用 try-catch 或配置 ignore 规则
    // 这样即使有小的 A11y 缺陷，测试也会继续，但会在控制台打印错误
    try {
      await checkA11y(page, {
        axeOptions: {
          runOnly: ['wcag2a', 'best-practice'], // 只跑最基础和最佳实践规则
        },
      });
    } catch (e) {
      console.warn('A11y violations detected but continuing / 检测到无障碍缺陷，已记录日志：', e);
    }
  });
});