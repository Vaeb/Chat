import mapKeys from 'lodash/mapKeys';

const linkedQuery = ({ keyModel, keyWhere, returnModel, returnWhere }) => {
    const keyTableName = keyModel.getTableName();
    if (keyWhere) keyWhere = mapKeys(keyWhere, (value, key) => `$${keyTableName}.${key}$`);

    const seqQuery = {
        include: [{ model: keyModel, where: keyWhere }],
    };

    if (returnWhere) seqQuery.where = returnWhere;

    return returnModel.findAll(seqQuery);
};

export default linkedQuery;
