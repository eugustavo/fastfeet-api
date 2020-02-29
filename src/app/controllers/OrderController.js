import * as Yup from 'yup';
import Order from '../models/Order';
import File from '../models/File';
import Deliveryman from '../models/Deliveryman';
import Recipient from '../models/Recipient';

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

    const { id, recipient_id, deliveryman_id, product } = await Order.create(
      req.body
    );

    return res.json({ id, recipient_id, deliveryman_id, product });
  }
}

export default new OrderController();
