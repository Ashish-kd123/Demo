'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    
    static associate(models) {
      Payment.belongsTo(models.Usersubscriptions,{
        foreignKey:'subscription_id',
        targetKey:'id',
       })
    }
  }
  Payment.init({
    id:{
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    subscription_id: {
      type: DataTypes.UUID, 
      defaultValue: DataTypes.UUIDV,
      allowNull: false,
      references: {
        model: "Usersubscriptions",
        key: "id",
      }
    },

    amount:{
      type: DataTypes.DECIMAL(10, 2),
    allowNull: false
    },
    payment_date: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('paid', 'failed', 'pending'),
      allowNull: false
    },
    // transaction_id: {
    //   type: DataTypes.STRING,
    //   allowNull: false
    // },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'Payments',
  });
  return Payment;
};