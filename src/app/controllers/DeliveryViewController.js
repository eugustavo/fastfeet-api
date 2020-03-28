import Order from '../models/Order';

class DeliveryViewController {
  async index(req, res) {
    const { page } = req.query;

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        start_date: null,
        end_date: null,
        canceled_at: null,
      },
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(orders);
  }
}

export default new DeliveryViewController();
