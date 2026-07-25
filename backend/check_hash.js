const bcrypt = require('bcrypt');
const hash = '$2b$10$QOBOkvaf3Y5zpKg4gom1mufILzq1iaYimvzOmMwISVxpVuZwVJPnG';
bcrypt.compare('password123', hash).then(console.log);
