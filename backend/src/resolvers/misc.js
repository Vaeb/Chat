import nodeUtils from 'util';
import formatErrors from '../formatErrors';
import { requiresPermission } from '../permissions';
import { linkedQuery } from '../linkedQueries';
import { pubsub, HEARTBEAT } from '../pubsub';

export default {
    Subscription: {
        heartbeat: {
            resolve: payload => payload,
            subscribe: () => pubsub.asyncIterator(HEARTBEAT),
        },
    },
    Query: {
        ping: () => 'pong',
        userRoles: async (parent, args, { models, me }) => {
            const userRoles = linkedQuery({
                keyModel: models.User,
                keyWhere: { id: me ? me.id : 7 },
                returnModel: models.Role,
                returnWhere: { view: true },
            });

            return userRoles;
        },
        // test
        userPermissions: async (parent, args, { models, me }) =>
            linkedQuery({
                keyModel: models.User,
                keyWhere: { id: me ? me.id : 1 },
                midModel: models.Role,
                returnModel: models.Permission,
            }),
    },
    Mutation: {
        runSeq: requiresPermission('').createResolver({ catchErrors: true }, async (parent, { text }, { models }) => {
            try {
                text = `(async function() {\n${text}\n})()`;
                console.log('running', text);
                const result = await eval(text);

                return {
                    ok: true,
                    errors: [],
                    output: nodeUtils.format(result),
                };
            } catch (err) {
                console.log('++++++++++++++++++++++++++++++++');
                console.log('ERROR:', err);
                console.log('--------------------------------');

                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        }),
        setData: async (parent, args, { models }) => {
            try {
                await models.sequelize.sync({ force: true });

                await Promise.all([
                    models.sequelize.query('ALTER SEQUENCE roles_id_seq RESTART WITH 1'),
                    models.sequelize.query('ALTER SEQUENCE permissions_id_seq RESTART WITH 1'),
                    models.sequelize.query('ALTER SEQUENCE users_id_seq RESTART WITH 1'),
                    models.sequelize.query('ALTER SEQUENCE channels_id_seq RESTART WITH 1'),
                ]);

                const dataRole = [
                    { /* id: 1, */ name: 'User' },
                    { /* id: 2, */ name: 'Suspended', view: false }, // for permissions
                    { /* id: 3, */ name: 'Muted', view: false }, // for permissions
                    { /* id: 4, */ name: 'Buyer', color: '#EF5350', position: 40 }, // for permissions
                    { /* id: 5, */ name: 'Support', color: '#00C853', position: 60 },
                    { /* id: 6, */ name: 'Staff', position: 100, view: false }, // for permissions
                    { /* id: 7, */ name: 'Moderator', color: '#FDD835', position: 140 },
                    { /* id: 8, */ name: 'Head Moderator', color: '#F57F17', position: 150 },
                    { /* id: 9, */ name: 'Administrator', position: 200, view: false, owner: true }, // for permissions
                    { /* id: 10, */ name: 'Developer', color: '#42A5F5', position: 240, owner: true },
                ];

                const dataPermission = [
                    { /* id: 1, */ name: 'SUSPENDED' }, // If a user has *any* role with SUSPENDED=true, they can't access chat (suspended)
                    { /* id: 2, */ name: 'MUTED' },
                    { /* id: 3, */ name: 'MUTE_USER' },
                    { /* id: 4, */ name: 'SUSPEND_USER' },
                    { /* id: 5, */ name: 'KICK_USER' },
                    { /* id: 6, */ name: 'BAN_USER' },
                    { /* id: 7, */ name: 'ADD_ROLE' },
                ];

                const dataUser = [
                    { /* id: 1, */ username: 'Vaeb', email: 'vaebmail@gmail.com', password: 'vaebmail@gmail.com' },
                    { /* id: 2, */ username: 'NewUser1', email: 'new1@gmail.com', password: 'new1@gmail.com' },
                    { /* id: 3, */ username: 'BuyerUser1', email: 'buyer1@gmail.com', password: 'buyer1@gmail.com' },
                    { /* id: 4, */ username: 'SupportUser1', email: 'support1@gmail.com', password: 'support1@gmail.com' },
                    { /* id: 5, */ username: 'SupportUser2', email: 'support2@gmail.com', password: 'support2@gmail.com' },
                    { /* id: 6, */ username: 'ModUser1', email: 'mod1@gmail.com', password: 'mod1@gmail.com' },
                    { /* id: 7, */ username: 'ModUser2', email: 'mod2@gmail.com', password: 'mod2@gmail.com' },
                    { /* id: 8, */ username: 'DevUser1', email: 'dev1@gmail.com', password: 'dev1@gmail.com' },
                ];

                const dataChannel = [
                    { /* id: 1, */ name: 'how-to-buy', default_send: false },
                    { /* id: 2, */ name: 'rules', default_send: false },
                    { /* id: 3, */ name: 'announcements', default_send: false },
                    { /* id: 4, */ name: 'general' },
                    { /* id: 5, */ name: 'buyers', locked: true },
                    { /* id: 6, */ name: 'memes' },
                    { /* id: 7, */ name: 'support' },
                    { /* id: 8, */ name: 'bot-commands' },
                    { /* id: 9, */ name: 'staff', locked: true },
                    { /* id: 10, */ name: 'developers', locked: true },
                ];

                const maxRows = Math.max(dataRole.length, dataPermission.length, dataUser.length, dataChannel.length);

                for (let i = 0; i < maxRows; i++) {
                    const nextPromises = [];

                    if (i < dataRole.length) nextPromises.push(models.Role.create(dataRole[i]));
                    if (i < dataPermission.length) nextPromises.push(models.Permission.create(dataPermission[i]));
                    if (i < dataUser.length) nextPromises.push(models.User.create(dataUser[i]));
                    if (i < dataChannel.length) nextPromises.push(models.Channel.create(dataChannel[i]));

                    // eslint-disable-next-line no-await-in-loop
                    await Promise.all(nextPromises);
                }

                const dataRolePermission = [
                    // Which roles have which permissions
                    { roleId: 2, permissionId: 1 }, // Suspended - SUSPENDED
                    { roleId: 3, permissionId: 2 }, // Muted - MUTED
                    { roleId: 6, permissionId: 3 }, // Staff - MUTE_USER
                    { roleId: 6, permissionId: 4 }, // Staff - SUSPEND_USER
                    { roleId: 9, permissionId: 5 }, // Administrator - KICK_USER
                    { roleId: 9, permissionId: 6 }, // Administrator - BAN_USER
                    { roleId: 8, permissionId: 7 }, // Head Moderator - ADD_ROLE
                    { roleId: 9, permissionId: 7 }, // Administrator - ADD_ROLE
                ];

                const dataRoleUser = [
                    // Which roles belong to which users
                    { roleId: 4, userId: 3 }, // Buyer - BuyerUser1
                    { roleId: 4, userId: 4 }, // Buyer - SupportUser1
                    { roleId: 4, userId: 5 }, // Buyer - SupportUser2
                    { roleId: 4, userId: 6 }, // Buyer - ModUser1
                    { roleId: 4, userId: 7 }, // Buyer - ModUser2
                    { roleId: 5, userId: 4 }, // Support - SupportUser1
                    { roleId: 5, userId: 5 }, // Support - SupportUser2
                    { roleId: 6, userId: 1 }, // Staff - Vaeb
                    { roleId: 6, userId: 6 }, // Staff - ModUser1
                    { roleId: 6, userId: 7 }, // Staff - ModUser2
                    { roleId: 6, userId: 8 }, // Staff - DevUser1
                    { roleId: 7, userId: 6 }, // Moderator - ModUser1
                    { roleId: 7, userId: 7 }, // Moderator - ModUser2
                    { roleId: 8, userId: 8 }, // Head Moderator - DevUser1
                    { roleId: 9, userId: 1 }, // Administrator - Vaeb
                    { roleId: 9, userId: 8 }, // Administrator - DevUser1
                    { roleId: 10, userId: 1 }, // Developer - Vaeb
                ];

                // You can get all users from User role

                for (let i = 0; i < dataUser.length; i++) dataRoleUser.push({ roleId: 1, userId: dataUser[i].id || i + 1 }); // Get all users from fixed role

                const dataRoleChannel = [
                    // Which roles can access which private channels (ignored if channel locked=false)
                    { roleId: 6, channelId: 3, send: true }, // Staff - announcements
                    { roleId: 4, channelId: 5 }, // Buyer - buyers
                    { roleId: 6, channelId: 5 }, // Staff - buyers
                    { roleId: 6, channelId: 9 }, // Staff - staff
                    { roleId: 9, channelId: 10 }, // Administrator - developers
                ];

                // You can get all roles from rules channel

                // for (let i = 0; i < dataRole.length; i++) dataRoleChannel.push({ roleId: dataRole[i].id || i + 1, channelId: 1 }); // Get all roles from fixed channel (rules)

                /* // Auto ignored when private
                    for (let i = 0; i < dataChannel.length; i++) {
                        // Can't have role_id: 1, channel_id: 1, again (from above query)
                        if (dataChannel[i].id != 1) {
                            dataRoleChannel.push({ roleId: 1, channelId: dataChannel[i].id }); // Get all channels from fixed role
                        }
                    }
                */

                await Promise.all([
                    models.RolePermission.bulkCreate(dataRolePermission),
                    models.RoleUser.bulkCreate(dataRoleUser),
                    models.RoleChannel.bulkCreate(dataRoleChannel),
                ]);

                return {
                    ok: true,
                    errors: [],
                };
            } catch (err) {
                console.log('++++++++++++++++++++++++++++++++');
                console.log('ERROR:', err);
                console.log('--------------------------------');

                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        },
    },
};
