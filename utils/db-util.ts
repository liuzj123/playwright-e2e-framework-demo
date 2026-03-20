import sqlite3 from 'sqlite3';
import { promisify } from 'util';

export class DbUtil {
  // 模拟连接数据库并执行查询
  static async verifyOrderExists(orderId: number): Promise<boolean> {
    // 实际项目中这里会用 process.env.DB_URL
    const db = new sqlite3.Database(':memory:'); 
    const get = promisify(db.get).bind(db);

    try {
      // 模拟初始化数据（实际测试中你会查正式表）
      await new Promise((resolve) => {
        db.serialize(() => {
          db.run("CREATE TABLE orders (id INT, status TEXT)");
          db.run("INSERT INTO orders VALUES (101, 'PAID')");
          resolve(null);
        });
      });

      const row: any = await get("SELECT * FROM orders WHERE id = ?", [orderId]);
      return !!row;
    } finally {
      db.close();
    }
  }
}