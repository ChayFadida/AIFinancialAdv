import { Router } from 'express';
import { getLatestReport } from '../controller';
import { auth } from '../../../middleware';

const reportsRouter = Router();

// Fetch conversation for a specific user
reportsRouter.get('/Q&K', auth, getLatestReport);

export { reportsRouter };
