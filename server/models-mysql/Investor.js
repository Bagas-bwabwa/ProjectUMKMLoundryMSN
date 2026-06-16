const { query } = require('../config/mysql');

class Investor {
  // Link investor to outlet
  static async linkToOutlet(investorId, outletId, investmentAmount, ownershipPercentage) {
    const sql = `
      INSERT INTO investor_outlets (investor_id, outlet_id, investment_amount, ownership_percentage)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE 
        investment_amount = VALUES(investment_amount),
        ownership_percentage = VALUES(ownership_percentage)
    `;
    
    await query(sql, [investorId, outletId, investmentAmount, ownershipPercentage]);
    return this.getInvestorOutlets(investorId);
  }

  // Get investor's outlets
  static async getInvestorOutlets(investorId) {
    const sql = `
      SELECT o.*, io.investment_amount, io.ownership_percentage
      FROM outlets o
      INNER JOIN investor_outlets io ON o.id = io.outlet_id
      WHERE io.investor_id = ? AND o.active = TRUE
      ORDER BY o.name
    `;
    
    return await query(sql, [investorId]);
  }

  // Get investor's financial report
  static async getInvestorFinancialReport(investorId, outletId = null) {
    let outletFilter = '';
    const params = [investorId];
    
    if (outletId) {
      outletFilter = ' AND o.id = ?';
      params.push(outletId);
    }

    const sql = `
      SELECT 
        o.id as outlet_id,
        o.name as outlet_name,
        io.investment_amount,
        io.ownership_percentage,
        COUNT(t.id) as total_transactions,
        COALESCE(SUM(t.final_amount), 0) as total_revenue,
        COALESCE(SUM(t.final_amount), 0) - o.operational_cost as gross_profit,
        (COALESCE(SUM(t.final_amount), 0) - o.operational_cost) * io.ownership_percentage / 100 as investor_share,
        o.operational_cost,
        MIN(t.created_at) as period_start,
        MAX(t.created_at) as period_end
      FROM outlets o
      INNER JOIN investor_outlets io ON o.id = io.outlet_id
      LEFT JOIN transactions t ON o.id = t.outlet_id 
        AND t.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      WHERE io.investor_id = ? ${outletFilter}
      GROUP BY o.id, io.investment_amount, io.ownership_percentage
      ORDER BY o.name
    `;

    return await query(sql, params);
  }

  // Check if investor has access to outlet
  static async hasAccessToOutlet(investorId, outletId) {
    const sql = `
      SELECT COUNT(*) as count 
      FROM investor_outlets 
      WHERE investor_id = ? AND outlet_id = ?
    `;
    
    const result = await query(sql, [investorId, outletId]);
    return result[0].count > 0;
  }

  // Get all investors for an outlet
  static async getOutletInvestors(outletId) {
    const sql = `
      SELECT u.*, io.investment_amount, io.ownership_percentage
      FROM users u
      INNER JOIN investor_outlets io ON u.id = io.investor_id
      WHERE io.outlet_id = ? AND u.role = 'investor'
      ORDER BY io.investment_amount DESC
    `;
    
    return await query(sql, [outletId]);
  }

  // Remove investor from outlet
  static async removeFromOutlet(investorId, outletId) {
    const sql = 'DELETE FROM investor_outlets WHERE investor_id = ? AND outlet_id = ?';
    await query(sql, [investorId, outletId]);
    return true;
  }

  // Get total investment by investor
  static async getTotalInvestment(investorId) {
    const sql = `
      SELECT 
        SUM(investment_amount) as total_investment,
        COUNT(*) as total_outlets
      FROM investor_outlets 
      WHERE investor_id = ?
    `;
    
    const result = await query(sql, [investorId]);
    return result[0];
  }
}

module.exports = Investor;