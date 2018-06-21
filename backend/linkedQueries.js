// eslint-disable-next-line object-curly-newline
const linkedQuery = ({ keyModel, keyWhere, midModel, midWhere, returnModel, returnWhere, findOne }) => {
    const seqQuery = midModel
        ? {
            include: [
                {
                    model: midModel,
                    include: [
                        {
                            model: keyModel,
                            where: keyWhere,
                        },
                    ],
                    where: midWhere,
                    required: true,
                },
            ],
        }
        : {
            include: [
                {
                    model: keyModel,
                    where: keyWhere,
                },
            ],
        };

    if (returnWhere) seqQuery.where = returnWhere;

    return findOne ? returnModel.findOne(seqQuery) : returnModel.findAll(seqQuery);
};

export default linkedQuery;
