import Order from '../models/Order';
import Recipient from '../models/Recipient';

class DeliveryViewController {
  async index(req, res) {
    const { page } = req.query;

    const orders = await Order.findAll({
      where: {
        deliveryman_id: req.params.id,
        end_date: null,
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
      limit: 10,
      offset: (page - 1) * 10,
    });

    return res.json(orders);
  }
}

export default new DeliveryViewController();
