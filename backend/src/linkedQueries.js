export const linkedQueryId = ({ keyModel, midModel, returnModel, id }) => {
    const midTable = midModel.getTableName();
    const returnTable = returnModel.getTableName();

    const keyMidCol = keyModel.getTableName().slice(0, -1);
    const retMidCol = returnTable.slice(0, -1);

    return returnModel.sequelize.query(
        `select u.* from ${returnTable} as u join ${midTable} as m on m.${retMidCol}_id = u.id where m.${keyMidCol}_id = ?`,
        {
            replacements: [id],
            model: returnModel,
            raw: true,
        },
    );
};

// eslint-disable-next-line object-curly-newline
export const linkedQuery = ({ keyModel, keyWhere, midModel, midWhere, returnModel, returnWhere, findOne }) => {
    // prettier-ignore
    const linkInclude = midModel
        ? [{
            model: midModel,
            include: [
                {
                    model: keyModel,
                    where: keyWhere,
                },
            ],
            where: midWhere,
            required: true,
        }] : [{
            model: keyModel,
            where: keyWhere,
        }];

    const seqQuery = { include: linkInclude, raw: true };

    if (returnWhere) seqQuery.where = returnWhere;

    return findOne ? returnModel.findOne(seqQuery) : returnModel.findAll(seqQuery);
};
