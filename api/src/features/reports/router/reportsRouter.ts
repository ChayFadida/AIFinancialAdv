import { Router } from 'express';
import { getLatestReport, getAllReport } from '../controller';
import { auth } from '../../../middleware';

const reportsRouter = Router();

// Fetch conversation for a specific user
reportsRouter.get('/stocksReports', auth, getLatestReport);
reportsRouter.get('/getAllReport', auth, getAllReport);
export { reportsRouter };
