const fs = require('fs');
let data = fs.readFileSync('schema.sql', 'utf8');
data = data.replace(/"id" UUID NOT NULL,/g, '"id" UUID NOT NULL DEFAULT gen_random_uuid(),');
data = data.replace(/"updatedAt" TIMESTAMP\(3\) NOT NULL,/g, '"updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,');
fs.writeFileSync('schema.sql', data);
console.log('Schema fixed!');
