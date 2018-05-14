/// <reference types="sequelize" />
import { DataTypes, Model, Sequelize } from 'sequelize';
export interface Role {
    name: string;
    position: number;
    color: string;
}
declare const _default: (sequelize: Sequelize, dataTypes: DataTypes) => Model<any, any>;
export default _default;
