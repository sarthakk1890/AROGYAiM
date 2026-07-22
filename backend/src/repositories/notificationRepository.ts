import { pool } from '../db';
import { Notification, NotificationPreference } from '../types/models';

class NotificationRepository {
  async findMany(userId: string, skip: number, take: number, isRead?: boolean, type?: string) {
    let query = `SELECT * FROM "Notification" WHERE "userId" = $1 AND "deletedAt" IS NULL`;
    const params: any[] = [userId];
    let paramIndex = 2;

    if (isRead !== undefined) {
      query += ` AND "isRead" = $${paramIndex++}`;
      params.push(isRead);
    }
    
    if (type) {
      query += ` AND type = $${paramIndex++}`;
      params.push(type);
    }

    const countQuery = query.replace('SELECT *', 'SELECT COUNT(*)');
    
    query += ` ORDER BY "createdAt" DESC OFFSET $${paramIndex++} LIMIT $${paramIndex++}`;
    params.push(skip, take);

    const [notificationsResult, totalResult] = await Promise.all([
      pool.query(query, params),
      pool.query(countQuery, params.slice(0, params.length - 2))
    ]);

    return { 
      notifications: notificationsResult.rows, 
      total: parseInt(totalResult.rows[0].count, 10) 
    };
  }

  async countUnread(userId: string): Promise<number> {
    const result = await pool.query(
      `SELECT COUNT(*) FROM "Notification" WHERE "userId" = $1 AND "isRead" = false AND "deletedAt" IS NULL`,
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  }

  async create(data: Partial<Notification>): Promise<Notification> {
    const keys = Object.keys(data);
    const columns = keys.map(k => `"${k}"`).join(', ');
    const values = keys.map((_, i) => `$${i + 1}`).join(', ');
    const result = await pool.query(
      `INSERT INTO "Notification" (${columns}) VALUES (${values}) RETURNING *`,
      Object.values(data)
    );
    return result.rows[0];
  }

  async markAsRead(id: string, userId: string) {
    const result = await pool.query(
      `UPDATE "Notification" SET "isRead" = true WHERE id = $1 AND "userId" = $2`,
      [id, userId]
    );
    return result.rowCount;
  }

  async markAllAsRead(userId: string) {
    const result = await pool.query(
      `UPDATE "Notification" SET "isRead" = true WHERE "userId" = $1 AND "isRead" = false AND "deletedAt" IS NULL`,
      [userId]
    );
    return result.rowCount;
  }

  async softDelete(id: string, userId: string) {
    const result = await pool.query(
      `UPDATE "Notification" SET "deletedAt" = NOW() WHERE id = $1 AND "userId" = $2`,
      [id, userId]
    );
    return result.rowCount;
  }
}

class NotificationPreferenceRepository {
  async findByUserId(userId: string): Promise<NotificationPreference> {
    let result = await pool.query(`SELECT * FROM "NotificationPreference" WHERE "userId" = $1`, [userId]);
    if (result.rows.length === 0) {
      result = await pool.query(`INSERT INTO "NotificationPreference" ("userId") VALUES ($1) RETURNING *`, [userId]);
    }
    return result.rows[0];
  }

  async update(userId: string, data: Partial<NotificationPreference>): Promise<NotificationPreference> {
    const keys = Object.keys(data).filter(k => k !== 'userId');
    if (keys.length === 0) return this.findByUserId(userId);

    const setClause = keys.map((key, index) => `"${key}" = $${index + 2}`).join(', ');
    const values = keys.map(key => (data as any)[key]);
    
    // Upsert equivalent
    const query = `
      INSERT INTO "NotificationPreference" ("userId", ${keys.map(k => `"${k}"`).join(', ')})
      VALUES ($1, ${keys.map((_, i) => `$${i + 2}`).join(', ')})
      ON CONFLICT ("userId") DO UPDATE SET ${setClause}, "updatedAt" = NOW()
      RETURNING *
    `;
    const result = await pool.query(query, [userId, ...values]);
    return result.rows[0];
  }
}

export const notificationRepository = new NotificationRepository();
export const notificationPreferenceRepository = new NotificationPreferenceRepository();
