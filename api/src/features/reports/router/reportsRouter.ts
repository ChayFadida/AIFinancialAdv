import { Router } from 'express';
import { getLatestReport, getAllReport, forceGenerateReport } from '../controller';
import { auth } from '../../../middleware';

const reportsRouter = Router();

// Fetch conversation for a specific user
reportsRouter.get('/stocksReports', auth, getLatestReport);
reportsRouter.get('/getAllReport', auth, getAllReport);
reportsRouter.get('/forceGenerateReport', auth, forceGenerateReport)
export { reportsRouter };
