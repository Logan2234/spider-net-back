import Domain from '@/models/domain.model';
import { ApiError } from '@/utils/apiError';
import { Op } from 'sequelize';

const searchDomains = async (searchTerm: string) => {
    if (!searchTerm) {
        throw new ApiError('Search term is required', 400);
    }

    const result = await Domain.findAll({
        // attributes: ['name', fn('COUNT', col('visitedSites.url'))],
        // include: VisitedSiteBelongsToDomain,
        // order: [[Sequelize.literal('"numberOfVisits"'), 'DESC']],
        where: {
            name: {
                [Op.iLike]: `%${searchTerm}%`
            }
        },
        // group: ['name'],
        limit: 8
        // logging: true
    });

    return result;
};

export default searchDomains;
