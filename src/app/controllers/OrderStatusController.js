import * as Yup from 'yup';
import Order from '../models/Order';

class OrderStatusController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
      canceled_at: Yup.date(),
      signature_id: Yup.number().when('end_date', (end_date, field) =>
        end_date ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(401).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const order = await Order.findByPk(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (req.body.start_date && order.start_date) {
      return res
        .status(401)
        .json({ error: 'Withdrawal date already registered' });
    }
    if (req.body.end_date && order.end_date) {
      return res
        .status(401)
        .json({ error: 'Delivery date already registered' });
    }
    if (req.body.canceled_at && order.canceled_at) {
      return res.status(401).json({ error: 'Cancel date already registered' });
    }

    order.update(req.body);
    order.save();

    return res.json(order);
  }
}

export default new OrderStatusController();
