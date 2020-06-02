import { Op } from 'sequelize';
import Order from '../models/Order';
import Recipient from '../models/Recipient';

class HandedController {
  async index(req, res) {
    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        start_date: { [Op.ne]: null },
        end_date: { [Op.ne]: null },
        canceled_at: null,
      },
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'street_number',
            'complement',
            'state',
            'city',
            'zipcode',
          ],
        },
      ],
    });

    return res.json(orders);
  }
}

export default new HandedController();
