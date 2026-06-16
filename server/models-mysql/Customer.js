const { query } = require('../config/mysql');

class Customer {
  // Create new customer
  static async create(customerData) {
    const {
      name,
      phone,
      address,
      membership = 'Regular',
      notes
    } = customerData;

    const sql = `
      INSERT INTO customers (name, phone, address, membership, notes)
      VALUES (?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [name, phone, address, membership, notes]);
    return this.findById(result.insertId);
  }

  // Find customer by ID
  static async findById(id) {
    const sql = 'SELECT * FROM customers WHERE id = ?';
    const customers = await query(sql, [id]);
    return customers[0] || null;
  }

  // Find customer by phone
  static async findByPhone(phone) {
    const sql = 'SELECT * FROM customers WHERE phone = ?';
    const customers = await query(sql, [phone]);
    return customers[0] || null;
  }

  // Get all customers with pagination
  static async findAll({ page = 1, limit = 10, search = '', membership = '' } = {}) {
    let whereClause = '';
    const params = [];
    
    if (search) {
      whereClause += ' AND (name LIKE ? OR phone LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    if (membership) {
      whereClause += ' AND membership = ?';
      params.push(membership);
    }
    
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT * FROM customers 
      WHERE 1=1 ${whereClause}
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `;
    
    const countSql = `
      SELECT COUNT(*) as total FROM customers WHERE 1=1 ${whereClause}
    `;
    
    const [customers, countResult] = await Promise.all([
      query(sql, [...params, limit, offset]),
      query(countSql, params)
    ]);
    
    return {
      customers,
      total: countResult[0].total,
      page,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  // Update customer
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
    const sql = `UPDATE customers SET ${fields.join(', ')} WHERE id = ?`;
    
    await query(sql, values);
    return this.findById(id);
  }

  // Delete customer
  static async delete(id) {
    const sql = 'DELETE FROM customers WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Update customer stats after transaction
  static async updateStats(customerId, amount) {
    const sql = `
      UPDATE customers 
      SET total_transactions = total_transactions + 1,
          total_spent = total_spent + ?,
          last_visit = CURRENT_DATE
      WHERE id = ?
    `;
    
    await query(sql, [amount, customerId]);
    return this.findById(customerId);
  }

  // Get customer statistics
  static async getStats() {
    const membershipStatsSql = `
      SELECT 
        membership,
        COUNT(*) as count,
        SUM(total_spent) as total_spent,
        AVG(total_transactions) as avg_transactions
      FROM customers 
      GROUP BY membership
    `;
    
    const topCustomersSql = `
      SELECT 
        id, name, phone, membership, total_spent, total_transactions
      FROM customers 
      ORDER BY total_spent DESC 
      LIMIT 5
    `;
    
    const totalCustomersSql = 'SELECT COUNT(*) as total FROM customers';
    
    const [membershipStats, topCustomers, totalResult] = await Promise.all([
      query(membershipStatsSql),
      query(topCustomersSql),
      query(totalCustomersSql)
    ]);
    
    return {
      membershipStats,
      topCustomers,
      totalCustomers: totalResult[0].total
    };
  }

  // Search customers
  static async search(searchTerm) {
    const sql = `
      SELECT * FROM customers 
      WHERE name LIKE ? OR phone LIKE ? 
      ORDER BY name
      LIMIT 20
    `;
    
    return await query(sql, [`%${searchTerm}%`, `%${searchTerm}%`]);
  }

  // Count customers
  static async count() {
    const sql = 'SELECT COUNT(*) as count FROM customers';
    const result = await query(sql);
    return result[0].count;
  }
}

module.exports = Customer;