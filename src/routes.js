import { Router } from 'express';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', SessionController.store);

routes.use(authMiddleware);

routes.post('/recipients', RecipientController.store);
routes.put('/recipients', RecipientController.update);

export default routes;
