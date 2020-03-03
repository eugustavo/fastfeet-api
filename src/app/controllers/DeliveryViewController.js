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
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(orders);
  }
}

export default new DeliveryViewController();
