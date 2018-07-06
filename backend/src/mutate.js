import models from './models';
import { pubsub, NEW_ROLE_USER, CHANGE_USER } from './pubsub';
import { linkedQuery, linkedQueryId } from './linkedQueries';

export default {
    addUserToRole: async ({
        roleId, userId, role, user, transaction,
    }) => {
        await models.RoleUser.create({ roleId, userId }, { transaction });

        const asyncFunc = async () => {
            const doPromises = [];

            if (!role) {
                doPromises.push(new Promise(async (resolve) => {
                    role = await models.Role.findOne({ where: { id: roleId }, raw: true });
                    resolve(true);
                }));
            }

            if (!user) {
                doPromises.push(new Promise(async (resolve) => {
                    user = await models.User.findOne({ where: { id: userId }, raw: true });
                    resolve(true);
                }));
            }

            await Promise.all(doPromises);

            pubsub.publish(NEW_ROLE_USER, {
                newRoleUser: {
                    role,
                    user,
                },
            });

            pubsub.publish(CHANGE_USER, {
                changeUser: user,
            });
        };

        asyncFunc();

        return {
            ok: true,
            user,
            errors: [],
        };
    },
};
