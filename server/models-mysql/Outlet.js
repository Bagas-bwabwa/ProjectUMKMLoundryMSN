const { query } = require('../config/mysql');

class Outlet {
  // Create new outlet
  static async create(outletData) {
    const {
      name,
      address,
      phone,
      manager_id,
      investor_percentage = 30, // Default 30% untuk investor
      operational_cost = 0
    } = outletData;

    const sql = `
      INSERT INTO outlets (name, address, phone, manager_id, investor_percentage, operational_cost)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [name, address, phone, manager_id, investor_percentage, operational_cost]);
    return this.findById(result.insertId);
  }

  // Find outlet by ID
  static async findById(id) {
    const sql = `
      SELECT o.*, u.name as manager_name, u.email as manager_email
      FROM outlets o
      LEFT JOIN users u ON o.manager_id = u.id
      WHERE o.id = ?
    `;
    const outlets = await query(sql, [id]);
    return outlets[0] || null;
  }

  // Get all outlets
  static async findAll() {
    const sql = `
      SELECT o.*, u.name as manager_name, 
             COUNT(t.id) as total_transactions,
             COALESCE(SUM(t.final_amount), 0) as total_revenue
      FROM outlets o
      LEFT JOIN users u ON o.manager_id = u.id
      LEFT JOIN transactions t ON o.id = t.outlet_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `;
    return await query(sql);
  }

  // Update outlet
  static async update(id, updates) {
    const fields = [];
    const values = [];
    
    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(updates[key]);
      }
    });
    
    if (fields.length === 0) return this.findById(id);
    
    values.push(id);
    const sql = `UPDATE outlets SET ${fields.join(', ')} WHERE id = ?`;
    
    await query(sql, values);
    return this.findById(id);
  }

  // Delete outlet
  static async delete(id) {
    const sql = 'UPDATE outlets SET active = FALSE WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Get outlet statistics
  static async getStats(outletId, period = 'monthly') {
    let dateFilter = '';
    
    switch (period) {
      case 'daily':
        dateFilter = 'AND DATE(t.created_at) = CURDATE()';
        break;
      case 'weekly':
        dateFilter = 'AND YEARWEEK(t.created_at) = YEARWEEK(CURDATE())';
        break;
      case 'monthly':
        dateFilter = 'AND YEAR(t.created_at) = YEAR(CURDATE()) AND MONTH(t.created_at) = MONTH(CURDATE())';
        break;
      default:
        dateFilter = '';
    }

    const sql = `
      SELECT 
        o.name as outlet_name,
        o.investor_percentage,
        o.operational_cost,
        COUNT(t.id) as total_transactions,
        COALESCE(SUM(t.final_amount), 0) as total_revenue,
        COALESCE(SUM(t.final_amount), 0) - o.operational_cost as gross_profit,
        (COALESCE(SUM(t.final_amount), 0) - o.operational_cost) * o.investor_percentage / 100 as investor_share,
        (COALESCE(SUM(t.final_amount), 0) - o.operational_cost) * (100 - o.investor_percentage) / 100 as owner_share
      FROM outlets o
      LEFT JOIN transactions t ON o.id = t.outlet_id ${dateFilter}
      WHERE o.id = ?
      GROUP BY o.id
    `;

    const stats = await query(sql, [outletId]);
    return stats[0] || null;
  }

  // Get outlet financial report
  static async getFinancialReport(outletId, startDate, endDate) {
    const sql = `
      SELECT 
        o.name as outlet_name,
        o.investor_percentage,
        o.operational_cost,
        COUNT(t.id) as total_transactions,
        COALESCE(SUM(t.final_amount), 0) as total_revenue,
        COALESCE(SUM(t.final_amount), 0) - o.operational_cost as gross_profit,
        (COALESCE(SUM(t.final_amount), 0) - o.operational_cost) * o.investor_percentage / 100 as investor_share,
        (COALESCE(SUM(t.final_amount), 0) - o.operational_cost) * (100 - o.investor_percentage) / 100 as owner_share,
        MIN(t.created_at) as period_start,
        MAX(t.created_at) as period_end
      FROM outlets o
      LEFT JOIN transactions t ON o.id = t.outlet_id 
        AND t.created_at BETWEEN ? AND ?
      WHERE o.id = ?
      GROUP BY o.id
    `;

    const report = await query(sql, [startDate, endDate, outletId]);
    return report[0] || null;
  }

  // Get all outlets with statistics
  static async getAllWithStats(period = 'monthly') {
    let dateFilter = '';
    
    switch (period) {
      case 'daily':
        dateFilter = 'AND DATE(t.created_at) = CURDATE()';
        break;
      case 'weekly':
        dateFilter = 'AND YEARWEEK(t.created_at) = YEARWEEK(CURDATE())';
        break;
      case 'monthly':
        dateFilter = 'AND YEAR(t.created_at) = YEAR(CURDATE()) AND MONTH(t.created_at) = MONTH(CURDATE())';
        break;
      default:
        dateFilter = '';
    }

    const sql = `
      SELECT 
        o.*,
        u.name as manager_name,
        COUNT(t.id) as total_transactions,
        COALESCE(SUM(t.final_amount), 0) as total_revenue,
        COALESCE(SUM(t.final_amount), 0) - o.operational_cost as gross_profit,
        (COALESCE(SUM(t.final_amount), 0) - o.operational_cost) * o.investor_percentage / 100 as investor_share,
        (COALESCE(SUM(t.final_amount), 0) - o.operational_cost) * (100 - o.investor_percentage) / 100 as owner_share
      FROM outlets o
      LEFT JOIN users u ON o.manager_id = u.id
      LEFT JOIN transactions t ON o.id = t.outlet_id ${dateFilter}
      WHERE o.active = TRUE
      GROUP BY o.id
      ORDER BY total_revenue DESC
    `;

    return await query(sql);
  }
}

module.exports = Outlet;