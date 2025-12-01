'use strict';
const { Model } = require('sequelize');

module.exports = ( sequelize, DataTypes ) => {
	class User extends Model {
		static associate( models ) {
			// define association here
		}
	}

	User.init({
		name : {
			type : DataTypes.STRING,
			allowNull : false,
		},
		comment : {
			type : DataTypes.STRING,
			allowNull : true,
		},
	}, {
		sequelize,
		tableName : 'users',
		modelName : 'User',
		timestamps : false,
	});

	return User;
};