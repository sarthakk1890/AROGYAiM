const { Client } = require('pg');
const client = new Client({ connectionString: 'postgresql://user:password@localhost:5432/mova' });

client.connect()
  .then(() => client.query('SELECT email, status, role, "deletedAt", "passwordHash" FROM "User"'))
  .then(res => {
    console.log(res.rows);
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
