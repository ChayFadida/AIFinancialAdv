import express from 'express';
import { saveContact } from '../controller';

const router = express.Router();

router.post('/', saveContact);

export default router;