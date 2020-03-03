import { Op } from 'sequelize';
import Order from '../models/Order';

class HandedController {
  async index(req, res) {
    const { page } = req.query;

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        start_date: { [Op.ne]: null },
        end_date: { [Op.ne]: null },
        canceled_at: null,
      },
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(orders);
  }
}

export default new HandedController();
