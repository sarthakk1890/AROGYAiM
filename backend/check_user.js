const { pool } = require('./dist/db');
pool.query("SELECT * FROM \"User\" WHERE email = '144singhsarthak@gmail.com'").then(res => {
  console.log(res.rows[0]);
  process.exit(0);
});
