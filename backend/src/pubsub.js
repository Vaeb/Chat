import { RedisPubSub } from 'graphql-redis-subscriptions';

const pubsub = new RedisPubSub({
    connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: 6379,
        retry_strategy: options => Math.max(options.attempt * 100, 3000),
    },
});

console.log(123, 'loading pubsub', pubsub != null);

export default pubsub;
