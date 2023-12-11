'use strict'
// const {
//   DataTypes
// } = require('sequelize');
const Sequelize = require('sequelize');

// const db = require('../config/db');
// db.sequelize = Sequelize;

module.exports = (Sequelize,DataTypes) => {
    const attributes = {

        name: {
            type: DataTypes.STRING(245),
            allowNull: false,
            defaultValue:"test",
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "name"
        },
        mobileno: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "mobileno"
        },

        status: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "status"
        },

        api_response: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "api_response"
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('current_timestamp'),
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "created_at"
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true,
            defaultValue: Sequelize.fn('current_timestamp'),
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "updated_at"
        },
        // courseName: {
        //   type: DataTypes.STRING(255),
        //   allowNull: false,
        //   field: "courseName"
        // }

    };

    const Logs = Sequelize.define("logs", attributes);
    return Logs;
};