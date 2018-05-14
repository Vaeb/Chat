import { Models } from './models';
export interface SequelizeContext {
    models: Models;
    user: {
        id: number;
    };
}
