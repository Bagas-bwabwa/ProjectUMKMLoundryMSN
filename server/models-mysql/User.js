const bcrypt = require('bcryptjs');
const { query } = require('../config/mysql');

class User {
  // Create new user
  static async create(userData) {
    const {
      name,
      email,
      password,
      role = 'cashier',
      phone,
      address
    } = userData;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
      INSERT INTO users (name, email, password, role, phone, address)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    
    const result = await query(sql, [name, email, hashedPassword, role, phone, address]);
    return this.findById(result.insertId);
  }

  // Find user by ID
  static async findById(id) {
    const sql = 'SELECT id, name, email, role, phone, address, active, created_at FROM users WHERE id = ?';
    const users = await query(sql, [id]);
    return users[0] || null;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email]);
    return users[0] || null;
  }

  // Get all users
  static async findAll() {
    const sql = 'SELECT id, name, email, role, phone, address, active, created_at FROM users ORDER BY created_at DESC';
    return await query(sql);
  }

  // Update user
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
    const sql = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    
    await query(sql, values);
    return this.findById(id);
  }

  // Delete user (soft delete)
  static async delete(id) {
    const sql = 'UPDATE users SET active = FALSE WHERE id = ?';
    await query(sql, [id]);
    return true;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Change password
  static async changePassword(id, newPassword) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    const sql = 'UPDATE users SET password = ? WHERE id = ?';
    await query(sql, [hashedPassword, id]);
    return true;
  }

  // Get users by role
  static async findByRole(role) {
    const sql = 'SELECT id, name, email, role, phone, address, active FROM users WHERE role = ? ORDER BY name';
    return await query(sql, [role]);
  }

  // Count users
  static async count() {
    const sql = 'SELECT COUNT(*) as count FROM users WHERE active = TRUE';
    const result = await query(sql);
    return result[0].count;
  }
}

module.exports = User;