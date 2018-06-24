import { RedisPubSub } from 'graphql-redis-subscriptions';
// import * as Redis from 'ioredis';

const redisSettings = {
    host: '127.0.0.1',
    port: 6379,
    retry_strategy: options => Math.max(options.attempt * 100, 3000),
};

// export default new RedisPubSub({
//     publisher: new Redis(redisSettings),
//     subscriber: new Redis(redisSettings),
// });

export default new RedisPubSub({
    connection: redisSettings,
});
