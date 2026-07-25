const { pool } = require('./dist/db');
pool.query('SELECT email, "createdAt" FROM "User"').then(res => {
  console.log(res.rows);
  process.exit(0);
});
