const sequelize = require('../../config/db');

const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Import and run all migration files in order
    const createUsersTable = require('./users');
    const createDonorsTable = require('./donors');
    const createHospitalsTable = require('./hospitals');
    const createBloodRequestsTable = require('./bloodRequests');
    const createDonationsTable = require('./donations');
    const createNotificationsTable = require('./notifications');
    const createMatchesTable = require('./matches');

    // Run migrations in order
    await createUsersTable.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Users table created successfully');

    await createDonorsTable.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Donors table created successfully');

    await createHospitalsTable.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Hospitals table created successfully');

    await createBloodRequestsTable.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Blood requests table created successfully');

    await createDonationsTable.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Donations table created successfully');

    await createNotificationsTable.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Notifications table created successfully');

    await createMatchesTable.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Matches table created successfully');

    console.log('All migrations executed successfully!');
  } catch (error) {
    console.error('Error running migrations:', error);
  } finally {
    await sequelize.close();
  }
};

// Run migrations if this file is executed directly
if (require.main === module) {
  runMigrations();
}

module.exports = { runMigrations };
