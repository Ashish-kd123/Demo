'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usersubscriptions extends Model {
   
    static associate(models) {
      Usersubscriptions.belongsTo(models.Users, {
        foreignKey: 'user_id',
        targetKey: 'id',
        onDelete: 'CASCADE',
      });
      Usersubscriptions.belongsTo(models.Plan, {
        foreignKey: 'plan_id',
        as:'plan',
        targetKey:'id',
      });
    }
  }
  Usersubscriptions.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    user_id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: "Users", 
        key: "id",
      },
    },
    stripe_subscription_id: {
      type: DataTypes.STRING(100),
    },
    plan_id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      references: {
        model: "Plans", 
        key: "id",
      },
    },
    status: {
      type: DataTypes.ENUM("active", "pending", "trialing","canceled"),
      defaultValue: "trialing",
    },
    started_at: {
      type: DataTypes.DATE,
    },
    ended_at: {
      type: DataTypes.DATE,
    }
  }, {
    sequelize,
    modelName: 'Usersubscriptions',
  });
  return Usersubscriptions;
};