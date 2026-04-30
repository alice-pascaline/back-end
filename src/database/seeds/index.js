const sequelize = require('../../config/db');

const runSeeds = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Import and run all seed files in order
    const usersSeed = require('./users');
    const donorsSeed = require('./donors');
    const hospitalsSeed = require('./hospitals');
    const bloodRequestsSeed = require('./bloodRequests');
    const donationsSeed = require('./donations');
    const notificationsSeed = require('./notifications');
    const matchesSeed = require('./matches');

    // Run seeds in order
    await usersSeed.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Users seeded successfully');

    await donorsSeed.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Donors seeded successfully');

    await hospitalsSeed.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Hospitals seeded successfully');

    await bloodRequestsSeed.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Blood requests seeded successfully');

    await donationsSeed.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Donations seeded successfully');

    await notificationsSeed.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Notifications seeded successfully');

    await matchesSeed.up(sequelize.getQueryInterface(), sequelize.Sequelize);
    console.log('Matches seeded successfully');

    console.log('All seeds executed successfully!');
  } catch (error) {
    console.error('Error running seeds:', error);
  } finally {
    await sequelize.close();
  }
};

// Run seeds if this file is executed directly
if (require.main === module) {
  runSeeds();
}

module.exports = { runSeeds };
