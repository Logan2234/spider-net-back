import searchDomains from '@/services/searchDomains';

const searchWebsites = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { searchTerm = '' } = req.query;
        const result = await searchDomains(searchTerm);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export default searchWebsites;
