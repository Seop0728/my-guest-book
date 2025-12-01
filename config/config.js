require('dotenv').config({ path: '.env' });
const env = process.env;

const development = {
    username: env.AWS_RDS_USERNAME,
    password: env.AWS_RDS_PASSWORD,
    database: env.AWS_RDS_DATABASE,
    host: env.AWS_RDS_HOST,
    dialect: 'mysql',
    timezone: '+09:00',
};


module.exports = { development }