// eslint-disable-next-line object-curly-newline
const linkedQuery = ({ keyModel, keyWhere, midModel, midWhere, returnModel, returnWhere, findOne }) => {
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

export default linkedQuery;
