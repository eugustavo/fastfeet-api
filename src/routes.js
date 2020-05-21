import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import FileController from './app/controllers/FileController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryViewController from './app/controllers/DeliveryViewController';
import HandedController from './app/controllers/HandedController';
import OrderController from './app/controllers/OrderController';
import OrderStatusController from './app/controllers/OrderStatusController';
import OrderEditController from './app/controllers/OrderEditController';
import DeliveryProblemController from './app/controllers/DeliveryProblemController';
import DeliverymanSessionController from './app/controllers/DeliverymanSessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', SessionController.store);
routes.post('/deliverymansession', DeliverymanSessionController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:id', DeliverymanController.update);
routes.delete('/deliverymans/:id', DeliverymanController.delete);

routes.get('/orders', OrderController.index);
routes.post('/orders', OrderController.store);
routes.put('/orders/:id', OrderController.update);
routes.put('/edit-order/:id', OrderEditController.update);
routes.delete('/orders/:id', OrderController.delete);

routes.get('/deliveryproblem', DeliveryProblemController.index);
routes.get('/deliveryproblem/:id/problem', DeliveryProblemController.show);
routes.get('/deliveryman/:id/deliveries', DeliveryViewController.index);
routes.get('/deliveryman/:id/handed', HandedController.index);

routes.delete('/problem/:id/cancel-delivery', DeliveryProblemController.delete);
routes.put('/order/:id/status', OrderStatusController.update);
routes.post('/delivery/:id/problems', DeliveryProblemController.store);

routes.post('/files', upload.single('file'), FileController.store);

export default routes;
