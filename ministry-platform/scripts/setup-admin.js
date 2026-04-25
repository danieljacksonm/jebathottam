const bcrypt = require('bcryptjs');

// Generate password hash for admin user
const password = process.argv[2] || 'admin123';
const hash = bcrypt.hashSync(password, 10);

console.log('Password:', password);
console.log('Hash:', hash);
console.log('\nSQL to update admin password:');
console.log(`UPDATE users SET password = '${hash}' WHERE email = 'admin@ministry.com';`);
