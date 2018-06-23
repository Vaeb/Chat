import pick from 'lodash/pick';
import nodeUtils from 'util';

export default (e, models) => {
    if (e instanceof models.sequelize.ValidationError) {
        return e.errors.map(x => pick(x, ['path', 'message']));
    }

    if (e instanceof Error) {
        return [{ path: e.name, message: e.message }];
    }

    return [{ path: 'unknown', message: `Unknown error: ${nodeUtils.format(e)}` }];
};
