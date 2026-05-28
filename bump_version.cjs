const fs = require('fs');
let file = './resources/views/pages/CustomerDashboard.tsx';
let data = fs.readFileSync(file, 'utf8');
data = data.replace(/vietagri_contracts_v2/g, 'vietagri_contracts_v3');
fs.writeFileSync(file, data, 'utf8');
