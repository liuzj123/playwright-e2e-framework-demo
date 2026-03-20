import sqlite3 from 'sqlite3';
import { promisify } from 'util';

// 💡 定义订单行的接口结构
interface OrderRow {
  id: number;
  status: string;
}

export class DbUtil {
  static async verifyOrderExists(orderId: number): Promise<boolean> {
    const db = new sqlite3.Database(':memory:'); 
    const get = promisify(db.get).bind(db);

    try {
      await new Promise((resolve) => {
        db.serialize(() => {
          db.run("CREATE TABLE orders (id INT, status TEXT)");
          db.run("INSERT INTO orders VALUES (101, 'PAID')");
          resolve(null);
        });
      });

      // 💡 在这里指定类型为 OrderRow | undefined
      const row = await get("SELECT * FROM orders WHERE id = ?", [orderId]) as OrderRow | undefined;
      
      return !!row;
    } finally {
      db.close();
    }
  }
}