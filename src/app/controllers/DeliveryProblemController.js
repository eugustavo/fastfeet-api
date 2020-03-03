import * as Yup from 'yup';
import Order from '../models/Order';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';
import DeliveryProblem from '../models/DeliveryProblem';

import CancellationMail from '../jobs/CancellationMail';
import Queue from '../../lib/Queue';

class DeliveryProblemController {
  async index(req, res) {
    const deliveryproblems = await DeliveryProblem.findAll({
      attributes: ['id', 'delivery_id', 'description'],
    });

    return res.json(deliveryproblems);
  }

  async show(req, res) {
    const delivery = await DeliveryProblem.findByPk(req.params.id);
    if (!delivery) {
      return res.status(404).json({ error: 'Delivery problem not found' });
    }

    const { id, delivery_id, description } = delivery;

    return res.json({
      id,
      delivery_id,
      description,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const orderExist = await Order.findByPk(req.body.delivery_id);
    if (!orderExist) {
      return res.status(401).json({ error: 'Informed order was not found' });
    }

    const { id, delivery_id, description } = await DeliveryProblem.create(
      req.body
    );

    return res.json({
      id,
      delivery_id,
      description,
    });
  }

  async delete(req, res) {
    const delivery_problem = await DeliveryProblem.findByPk(req.params.id);
    if (!delivery_problem) {
      return res.status(404).json({ error: 'Delivery problem not found' });
    }

    const delivery = await Order.findByPk(delivery_problem.delivery_id);
    if (!delivery) {
      return res.status(401).json({ error: 'informed order was not found' });
    }
    if (delivery.canceled_at) {
      return res
        .status(401)
        .json({ error: 'informed order is already canceled' });
    }

    delivery.canceled_at = new Date();
    delivery.save();

    const deliveryman = await Deliveryman.findByPk(delivery.deliveryman_id);
    const recipient = await Recipient.findByPk(delivery.recipient_id);

    await Queue.add(CancellationMail.key, {
      deliveryman,
      recipient,
      delivery,
    });

    return res.status(200).json();
  }
}

export default new DeliveryProblemController();
