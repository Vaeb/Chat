/// <reference types="bluebird" />
import * as Bluebird from 'bluebird';
import { SequelizeContext } from '..';
import { User } from '../models';
declare const _default: {
    Query: {
        getUser: (parent: any, { id }: {
            [argument: string]: any;
        }, { models }: SequelizeContext) => Bluebird<User | null>;
        allUsers: (parent: any, args: {
            [argument: string]: any;
        }, { models }: SequelizeContext) => Bluebird<User[]>;
    };
    Mutation: {
        createUser: (parent: any, args: {
            [argument: string]: any;
        }, { models }: SequelizeContext) => Bluebird<User>;
    };
};
export default _default;
