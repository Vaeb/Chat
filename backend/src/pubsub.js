import { RedisPubSub } from 'graphql-redis-subscriptions';

export const pubsub = new RedisPubSub({
    connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: 6379,
        retry_strategy: options => Math.max(options.attempt * 100, 3000),
    },
});

console.log(123, 'loading pubsub', pubsub != null);

export const HEARTBEAT = 'HEARTBEAT';
export const NEW_CHANNEL = 'NEW_CHANNEL';
export const NEW_ROLE = 'NEW_ROLE';
export const NEW_CHANNEL_MESSAGE = 'NEW_CHANNEL_MESSAGE';
export const NEW_ROLE_USER = 'NEW_ROLE_USER';
export const REM_ROLE_USER = 'REM_ROLE_USER';
export const NEW_USER = 'NEW_USER';
export const CHANGE_USER = 'CHANGE_USER';
