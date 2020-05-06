import Order from '../models/Order';

class OrderEditController {
  async update(req, res) {
    const { id } = req.params;
    const { deliveryman_id, recipient_id, product } = req.body;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(400).json({ error: 'Order not found' });
    }

    if (order.start_date) {
      return res
        .status(401)
        .json({ error: 'Order has already been withdrawn' });
    }

    order.update({
      deliveryman_id,
      recipient_id,
      product,
    });
    order.save();

    return res.json(order);
  }
}

export default new OrderEditController();
