
// Creating Customer model
module.exports = function(sequelize, DataTypes) {
   const Customer = sequelize.define("Customer", {
    // The name cannot be null
    name: {
      type: DataTypes.STRING,
       allowNull:false
    }
  })
  return Customer
};
