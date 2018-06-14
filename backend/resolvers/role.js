import formatErrors from '../formatErrors';
import { requiresAuth } from '../permissions';

/* const fetchMembers = ({ id }, args, { models }) =>
    models.sequelize.query('select * from users as u join roleusers as ru on ru.user_id = u.id where ru.role_id = ?', {
        replacements: [id],
        model: models.User,
        raw: true,
    }); */

export default {
    Query: {
        // allRoles: requiresAuth.createResolver(async (parent, args, { models }) => models.Role.findAll({ id: 1 }, { raw: true })),
        allRoles: async (parent, args, { models }) => models.Role.findAll({ id: 1 }, { raw: true }),
    },
    Mutation: {
        createRole: requiresAuth.createResolver(async (parent, args, { models }) => {
            try {
                await models.Role.create(args);

                return {
                    ok: true,
                    errors: [],
                };
            } catch (err) {
                console.log(err);

                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        }),
        addUsersToRoles: requiresAuth.createResolver(async (parent, { userIds, roleIds }, { models }) => {
            try {
                /* const usersToAddPromise = models.User.findAll(
                    {
                        where: {
                            id: { [models.Sequelize.Op.or]: userIds },
                        },
                    },
                    { raw: true },
                );

                const [usersToAdd] = await Promise.all([usersToAddPromise]); */

                const addRows = [];

                for (let i = 0; i < userIds.length; i++) {
                    const userId = userIds[i];

                    for (let j = 0; j < roleIds.length; j++) {
                        addRows.push({ userId, roleId: roleIds[i] });
                    }
                }

                await models.RoleUser.bulkCreate(addRows);

                console.log(111);

                return {
                    ok: true,
                    errors: [],
                };
            } catch (err) {
                console.log(err);

                return {
                    ok: false,
                    errors: formatErrors(err, models),
                };
            }
        }),
    },
    Role: {
        // channels: ({ id }, args, { models }) => models.RoleChannel.findAll({ roleId: id }),
        members: ({ id }, args, { models }) =>
            models.User.findAll({
                include: [{ model: models.Role }],
                where: { id },
            }),
        // permissions: ({ id }, args, { models }) => models.RolePermissions.findAll({ roleId: id }),
    },
};
