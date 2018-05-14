/// <reference types="bluebird" />
import * as Bluebird from 'bluebird';
import { SequelizeContext } from '..';
import { Permission } from '../models';
declare const _default: {
    Query: {
        getPermission: (parent: any, { id }: {
            [argument: string]: any;
        }, { models }: SequelizeContext) => Bluebird<Permission | null>;
    };
    Mutation: {
        createPermission: (parent: any, args: {
            [argument: string]: any;
        }, { models }: SequelizeContext) => Promise<any>;
    };
};
export default _default;
