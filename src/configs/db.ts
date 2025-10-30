import { Sequelize } from 'sequelize';

if (!process.env.CONNECTION_STRING) {
  throw new Error('❌ Missing CONNECTION_STRING in .env');
}

const databaseName = process.env.DATABASE_NAME || 'internet-visualizer';

let sequelize: Sequelize;

try {
  sequelize = new Sequelize(process.env.CONNECTION_STRING, {
    dialect: 'postgres',
    logging: false,
    logQueryParameters: false,
    database: databaseName,
    sync: { alter: true } // Will be disabled when implementing migrations
  });

  console.info(`✅ Database connection established [${databaseName}]`);
} catch (error) {
  console.error('❌ Unable to connect to database:', error);
  process.exit(1);
}

export default sequelize;
