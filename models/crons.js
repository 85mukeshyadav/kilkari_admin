'use strict'
// const {
//   DataTypes
// } = require('sequelize');
const Sequelize = require('sequelize');

// const db = require('../config/db');
// db.sequelize = Sequelize;

module.exports = (Sequelize,DataTypes) => {
    const attributes = {

        cronName: {
            type: DataTypes.STRING(245),
            allowNull: false,
            defaultValue:"test",
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "cronName"
        },

        command: {
            type: DataTypes.STRING(245),
            allowNull: false,
            defaultValue:"test",
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "command"
        },

        cronDesc: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "cronDesc"
        },

        second: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "second"
        },

        minute: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "minute"
        },

        hour: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "hour"
        },

        day: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "day"
        },

        month: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "month"
        },
        dayofweek: {
            type: DataTypes.TEXT,
            allowNull: true,
            defaultValue: null,
            primaryKey: false,
            autoIncrement: false,
            comment: null,
            field: "dayofweek"
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

    const options = {
        tableName: 'crons',
        comment: '',
        indexes: [],
    };

    const Cron = Sequelize.define("crons", attributes,options);
    return Cron;
};