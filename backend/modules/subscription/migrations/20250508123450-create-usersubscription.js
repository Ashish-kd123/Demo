  'use strict';
  /** @type {import('sequelize-cli').Migration} */
  module.exports = {
    async up(queryInterface, Sequelize) {
     
      await queryInterface.createTable('Usersubscriptions', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          defaultValue: Sequelize.literal('gen_random_uuid()'),
          allowNull: false,
        },
        user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Users',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        stripe_subscription_id: {
          type: Sequelize.STRING(100),
        },
        plan_id: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Plans',
            key: 'id',
          },
        },
        status: {
          type: Sequelize.ENUM("active", "pending", "trialing"),
          defaultValue: "trialing",
        },
        started_at: {
          type: Sequelize.DATE,
        },
        ended_at: {
          type: Sequelize.DATE,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      });
    },
    async down(queryInterface, Sequelize) {
      await queryInterface.dropTable('Usersubscriptions');
       await queryInterface.sequelize.query(`DROP TYPE enum_usersubscriptions_status;`);
    }
  };