var Customer = require('./customer.js');


// Creating Burger model
module.exports = function(sequelize, DataTypes) {
  const Burger = sequelize.define("Burger", {
    // id of the event
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    // event name
    name: {
      type: DataTypes.STRING,
      allowNull:false
    },
    // event description
    devoured: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      
    },
    // event date
    date: {
      type: DataTypes.DATE,
      allowNull: false      
    },
  });

  var customer = Customer(sequelize, DataTypes);
  Burger.belongsTo(customer, {as: 'customer', foreignKey: 'customer_id'});
  return Burger;
};
