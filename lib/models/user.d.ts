/// <reference types="sequelize" />
import { DataTypes, Model, Sequelize } from 'sequelize';
export interface User {
    username: string;
    email: string;
    password: string;
}
declare const _default: (sequelize: Sequelize, dataTypes: DataTypes) => Model<any, any>;
export default _default;
