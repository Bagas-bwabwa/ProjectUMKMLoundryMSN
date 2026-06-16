const bcrypt = require('bcryptjs');
const { query } = require('../config/mysql');

class User {
  constructor(data = {}) {
    Object.assign(this, data);
  }

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
    const sql = 'SELECT * FROM users WHERE id = ?';
    const users = await query(sql, [id]);
    return users[0] ? new User(users[0]) : null;
  }

  // Find user by email
  static async findByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    const users = await query(sql, [email]);
    return users[0] ? new User(users[0]) : null;
  }

  // MongoDB style findOne
  static async findOne(conditions) {
    if (conditions.email) {
      return await this.findByEmail(conditions.email);
    }
    if (conditions.id) {
      return await this.findById(conditions.id);
    }
    return null;
  }

  // Save instance method
  async save() {
    if (this.id) {
      // Update existing user
      const updates = {};
      if (this.name !== undefined) updates.name = this.name;
      if (this.email !== undefined) updates.email = this.email;
      if (this.password !== undefined) updates.password = this.password;
      if (this.role !== undefined) updates.role = this.role;
      if (this.phone !== undefined) updates.phone = this.phone;
      if (this.address !== undefined) updates.address = this.address;
      
      const updatedUser = await User.update(this.id, updates);
      Object.assign(this, updatedUser);
      return this;
    } else {
      // Create new user
      const userData = {
        name: this.name,
        email: this.email,
        password: this.password,
        role: this.role,
        phone: this.phone,
        address: this.address
      };
      const newUser = await User.create(userData);
      Object.assign(this, newUser);
      return this;
    }
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

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get all users
  static async findAll() {
    const sql = 'SELECT id, name, email, role, phone, address, active, created_at FROM users ORDER BY created_at DESC';
    const users = await query(sql);
    return users.map(user => new User(user));
  }

  // Delete user (soft delete)
  static async delete(id) {
    const sql = 'UPDATE users SET active = FALSE WHERE id = ?';
    await query(sql, [id]);
    return true;
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
    const users = await query(sql, [role]);
    return users.map(user => new User(user));
  }

  // Count users
  static async count() {
    const sql = 'SELECT COUNT(*) as count FROM users WHERE active = TRUE';
    const result = await query(sql);
    return result[0].count;
  }

  // Instance method untuk select (compatibility)
  select(fields) {
    // Simple implementation - return new object with selected fields
    const selected = {};
    if (fields === '-password') {
      Object.keys(this).forEach(key => {
        if (key !== 'password') {
          selected[key] = this[key];
        }
      });
      return selected;
    }
    return this;
  }
}

module.exports = User;