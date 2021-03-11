'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    
    return queryInterface.bulkInsert('Scores', [
      {
        userId: '1',
        wins: '0',
        createdAt: new Date(),
        updatedAt: new Date()
      },      {
        userId: '2',
        wins: '4',
        createdAt: new Date(),
        updatedAt: new Date()
      },      {
        userId: '1',
        wins: '3',
        createdAt: new Date(),
        updatedAt: new Date()
      },      {
        userId: '2',
        wins: '2',
        createdAt: new Date(),
        updatedAt: new Date()
      },      {
        userId: '1',
        wins: '0',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);

    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Favourites', null, {});
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
