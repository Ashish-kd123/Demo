'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Plan extends Model {
    static associate(models) {
     
      Plan.hasMany(models.Usersubscriptions, { as: "subscriptions", foreignKey: "plan_id" });
    }
  }

  Plan.init(
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      interval: {
        type: DataTypes.ENUM('monthly', 'yearly'),
        allowNull: false,
      },
      features: {
        type: DataTypes.JSON,
        allowNull: false,
      },
      stripe_price_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Plan', 
      tableName: 'Plans', 
      timestamps: true, 
    }
  );

  return Plan;
};