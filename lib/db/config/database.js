require('dotenv').config();
import {Sequelize, DataTypes} from 'sequelize';

const {POSTGRES_DB, POSTGRES_HOST, POSTGRES_PASSWORD, POSTGRES_USERNAME} = process.env;

module.exports = {
    Sequelize: new Sequelize(
        POSTGRES_DB, POSTGRES_USERNAME, POSTGRES_PASSWORD, 
        {
            dialect : 'postgres',
            host: POSTGRES_HOST
        }
    ),
    DataTypes: DataTypes
};
