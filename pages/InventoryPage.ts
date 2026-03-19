import { Page, Locator } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly shoppingCartBadge: Locator;

  // Constructor: Initialize page element locators
  // 构造函数：初始化页面元素定位器
  constructor(page: Page) {
    this.page = page;
    
    // Locate the shopping cart badge (the little red number on the top right)
    // 定位购物车角标（右上角的红色数字提示）
    this.shoppingCartBadge = page.locator('.shopping_cart_badge');
  }

  // Action: Add a specific item to the cart dynamically based on its name
  // 动作：根据商品名称，动态拼接定位器并点击“加入购物车”
  async addToCart(itemName: string) {
    // Convert item name to match the data-test attribute format
    // e.g., 'Sauce Labs Backpack' -> 'add-to-cart-sauce-labs-backpack'
    // 将商品名称转换为 data-test 属性的格式（大写转小写，空格换成横杠）
    const formattedName = itemName.toLowerCase().replace(/ /g, '-');
    const addToCartButton = this.page.locator(`[data-test="add-to-cart-${formattedName}"]`);
    
    await addToCartButton.click();
  }
}