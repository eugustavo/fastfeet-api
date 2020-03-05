import * as Yup from 'yup';
import { format, startOfDay, endOfDay } from 'date-fns';
import { Op } from 'sequelize';
import Order from '../models/Order';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

import NotificationOrder from '../jobs/NotificationOrder';
import Queue from '../../lib/Queue';

class OrderController {
  async index(req, res) {
    const { page } = req.query;

    const orders = await Order.findAll({
      attributes: ['id', 'product'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'name',
            'street',
            'street_number',
            'city',
            'state',
            'complement',
            'zipcode',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['name', 'email'],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.json(orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      product: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.body.deliveryman_id);
    const recipient = await Recipient.findByPk(req.body.recipient_id);

    const { id, recipient_id, deliveryman_id, product } = await Order.create(
      req.body
    );

    await Queue.add(NotificationOrder.key, {
      deliveryman,
      recipient,
      product,
    });

    return res.json({ id, product, recipient_id, deliveryman_id });
  }

  async update(req, res) {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    const avaiable = format(new Date(), 'HH');

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    if (order.start_date) {
      return res
        .status(401)
        .json({ error: 'Order has already been withdrawn' });
    }

    if (!(avaiable > 8 && avaiable < 22)) {
      return res
        .status(401)
        .json({ error: 'Order can only be withdrawn from 8am to 6pm' });
    }

    const deliveryman = await Deliveryman.findByPk(order.deliveryman_id);

    const withdrawnDeliveries = await Order.findAll({
      where: {
        start_date: {
          [Op.between]: [startOfDay(new Date()), endOfDay(new Date())],
        },
        deliveryman_id: deliveryman.id,
      },
    });

    if (withdrawnDeliveries.length > 4) {
      return res
        .status(401)
        .json({ error: 'Maximum number of withdrawals exceeded' });
    }

    order.start_date = new Date();

    order.save();

    return res.json(order);
  }

  async delete(req, res) {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    order.end_date = new Date();

    order.save();
    return res.status(200).json();
  }
}

export default new OrderController();
