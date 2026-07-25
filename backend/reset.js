const { pool } = require('./dist/db');
const bcrypt = require('bcrypt');

async function reset() {
  try {
    const hash = await bcrypt.hash('password123', 10);
    await pool.query('UPDATE "User" SET "passwordHash" = $1 WHERE email = $2', [hash, '144singhsarthak@gmail.com']);
    console.log('Password successfully reset to password123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
reset();
