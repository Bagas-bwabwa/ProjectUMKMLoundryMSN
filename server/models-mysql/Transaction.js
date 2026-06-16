const { query, transaction } = require('../config/mysql');

class Transaction {
  // Create new transaction with transaction services
  static async create(transactionData, servicesData) {
    return await transaction(async (conn) => {
      // First create the transaction
      const transactionSql = `
        INSERT INTO transactions (
          transaction_number, customer_id, customer_name, customer_phone,
          total_weight, total_amount, discount, final_amount,
          payment_status, status, payment_method, estimated_ready, notes, created_by
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      
      const transactionParams = [
        transactionData.transaction_number,
        transactionData.customer_id,
        transactionData.customer_name,
        transactionData.customer_phone,
        transactionData.total_weight,
        transactionData.total_amount,
        transactionData.discount || 0,
        transactionData.final_amount,
        transactionData.payment_status || 'Pending',
        transactionData.status || 'Pending',
        transactionData.payment_method || 'Cash',
        transactionData.estimated_ready,
        transactionData.notes,
        transactionData.created_by
      ];
      
      const [transactionResult] = await conn.execute(transactionSql, transactionParams);
      const transactionId = transactionResult.insertId;
      
      // Then create transaction services
      if (servicesData && servicesData.length > 0) {
        const servicesSql = `
          INSERT INTO transaction_services (
            transaction_id, service_id, service_name, weight, price, subtotal
          ) VALUES ?
        `;
        
        const servicesValues = servicesData.map(service => [
          transactionId,
          service.service_id,
          service.service_name,
          service.weight,
          service.price,
          service.subtotal
        ]);
        
        await conn.query(servicesSql, [servicesValues]);
      }
      
      // Update customer stats
      await conn.execute(
        'UPDATE customers SET total_transactions = total_transactions + 1, total_spent = total_spent + ?, last_visit = CURRENT_DATE WHERE id = ?',
        [transactionData.final_amount, transactionData.customer_id]
      );
      
      return this.findById(transactionId);
    });
  }

  // Find transaction by ID with details
  static async findById(id) {
    const transactionSql = `
      SELECT t.*, c.name as customer_name, c.phone as customer_phone, c.membership,
             u.name as created_by_name
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE t.id = ?
    `;
    
    const servicesSql = `
      SELECT ts.*, s.name as service_name, s.price_per_kg
      FROM transaction_services ts
      LEFT JOIN services s ON ts.service_id = s.id
      WHERE ts.transaction_id = ?
    `;
    
    const [transactions, services] = await Promise.all([
      query(transactionSql, [id]),
      query(servicesSql, [id])
    ]);
    
    if (transactions.length === 0) return null;
    
    const transaction = transactions[0];
    transaction.services = services;
    
    return transaction;
  }

  // Get all transactions with pagination and filtering
  static async findAll({ page = 1, limit = 10, status, paymentStatus, startDate, endDate } = {}) {
    let whereClause = '';
    const params = [];
    
    if (status) {
      whereClause += ' AND t.status = ?';
      params.push(status);
    }
    
    if (paymentStatus) {
      whereClause += ' AND t.payment_status = ?';
      params.push(paymentStatus);
    }
    
    if (startDate) {
      whereClause += ' AND DATE(t.created_at) >= ?';
      params.push(startDate);
    }
    
    if (endDate) {
      whereClause += ' AND DATE(t.created_at) <= ?';
      params.push(endDate);
    }
    
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT t.*, c.name as customer_name, c.phone, c.membership,
             u.name as created_by_name
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      LEFT JOIN users u ON t.created_by = u.id
      WHERE 1=1 ${whereClause}
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countSql = `
      SELECT COUNT(*) as total FROM transactions t WHERE 1=1 ${whereClause}
    `;
    
    const [transactions, countResult] = await Promise.all([
      query(sql, [...params, limit, offset]),
      query(countSql, params)
    ]);
    
    return {
      transactions,
      total: countResult[0].total,
      page,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }

  // Update transaction
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
    const sql = `UPDATE transactions SET ${fields.join(', ')} WHERE id = ?`;
    
    await query(sql, values);
    return this.findById(id);
  }

  // Delete transaction
  static async delete(id) {
    return await transaction(async (conn) => {
      // Get transaction details first for customer stats update
      const [transaction] = await conn.execute('SELECT customer_id, final_amount FROM transactions WHERE id = ?', [id]);
      
      if (transaction.length > 0) {
        // Update customer stats
        await conn.execute(
          'UPDATE customers SET total_transactions = total_transactions - 1, total_spent = total_spent - ? WHERE id = ?',
          [transaction[0].final_amount, transaction[0].customer_id]
        );
      }
      
      // Delete transaction services first (due to foreign key)
      await conn.execute('DELETE FROM transaction_services WHERE transaction_id = ?', [id]);
      
      // Delete transaction
      await conn.execute('DELETE FROM transactions WHERE id = ?', [id]);
      
      return true;
    });
  }

  // Generate transaction number
  static async generateTransactionNumber() {
    const countSql = 'SELECT COUNT(*) as count FROM transactions';
    const result = await query(countSql);
    const count = result[0].count + 1;
    
    return `TRX-${count.toString().padStart(6, '0')}`;
  }

  // Get transaction statistics
  static async getStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const statsQueries = {
      daily: `
        SELECT COUNT(*) as count, COALESCE(SUM(final_amount), 0) as revenue
        FROM transactions 
        WHERE DATE(created_at) = ?
      `,
      weekly: `
        SELECT COUNT(*) as count, COALESCE(SUM(final_amount), 0) as revenue
        FROM transactions 
        WHERE YEARWEEK(created_at) = YEARWEEK(CURRENT_DATE)
      `,
      monthly: `
        SELECT COUNT(*) as count, COALESCE(SUM(final_amount), 0) as revenue
        FROM transactions 
        WHERE YEAR(created_at) = YEAR(CURRENT_DATE) 
        AND MONTH(created_at) = MONTH(CURRENT_DATE)
      `,
      total: `
        SELECT COUNT(*) as total_count, COALESCE(SUM(final_amount), 0) as total_revenue
        FROM transactions
      `
    };
    
    const [daily, weekly, monthly, total] = await Promise.all([
      query(statsQueries.daily, [today]),
      query(statsQueries.weekly),
      query(statsQueries.monthly),
      query(statsQueries.total)
    ]);
    
    return {
      daily: {
        transactions: daily[0].count,
        revenue: parseFloat(daily[0].revenue) || 0
      },
      weekly: {
        transactions: weekly[0].count,
        revenue: parseFloat(weekly[0].revenue) || 0
      },
      monthly: {
        transactions: monthly[0].count,
        revenue: parseFloat(monthly[0].revenue) || 0
      },
      total: {
        transactions: total[0].total_count,
        revenue: parseFloat(total[0].total_revenue) || 0
      }
    };
  }

  // Get recent transactions
  static async getRecent(limit = 10) {
    const sql = `
      SELECT t.*, c.name as customer_name, c.phone
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      ORDER BY t.created_at DESC
      LIMIT ?
    `;
    
    return await query(sql, [limit]);
  }

  // Get transactions by customer
  static async findByCustomer(customerId, { page = 1, limit = 10 } = {}) {
    const offset = (page - 1) * limit;
    
    const sql = `
      SELECT t.*, c.name as customer_name, c.phone
      FROM transactions t
      LEFT JOIN customers c ON t.customer_id = c.id
      WHERE t.customer_id = ?
      ORDER BY t.created_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const countSql = 'SELECT COUNT(*) as total FROM transactions WHERE customer_id = ?';
    
    const [transactions, countResult] = await Promise.all([
      query(sql, [customerId, limit, offset]),
      query(countSql, [customerId])
    ]);
    
    return {
      transactions,
      total: countResult[0].total,
      page,
      totalPages: Math.ceil(countResult[0].total / limit)
    };
  }
}

module.exports = Transaction;