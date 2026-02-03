/**
 * Create Admin User Script
 * Usage: npm run create-admin
 */

const { pool } = require('../server/config/db');
const bcrypt = require('bcryptjs');

async function createAdmin() {
    console.log('🔐 Creating admin user...\n');
    
    const client = await pool.connect();
    
    try {
        // Delete existing admin user
        await client.query('DELETE FROM admin_users WHERE username = $1', ['admin']);
        console.log('  ✓ Removed old admin user (if existed)');
        
        // Hash password
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log('  ✓ Password hashed');
        
        // Insert new admin
        const result = await client.query(`
            INSERT INTO admin_users (username, password, email, full_name, is_active) 
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, username, email, full_name
        `, ['admin', hashedPassword, 'admin@worksglow.com', 'Administrator', true]);
        
        console.log('  ✓ Admin user created\n');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Admin credentials:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('User details:', result.rows[0]);
        
    } catch (error) {
        console.error('❌ Error creating admin:', error);
        throw error;
    } finally {
        client.release();
        await pool.end();
    }
}

// Run
createAdmin()
    .then(() => {
        console.log('\n🎉 Admin user created successfully!');
        console.log('You can now login with username: admin, password: admin123\n');
        process.exit(0);
    })
    .catch((error) => {
        console.error('💥 Failed to create admin:', error);
        process.exit(1);
    });