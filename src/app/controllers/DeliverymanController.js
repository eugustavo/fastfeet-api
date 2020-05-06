import * as Yup from 'yup';
import { Op } from 'sequelize';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const { page, findDeliveryman } = req.query;

    if (findDeliveryman) {
      const deliverymans = await Deliveryman.findAll({
        where: {
          name: {
            [Op.iLike]: `%${findDeliveryman}%`,
          },
        },
        attributes: ['id', 'name', 'email'],
        limit: 8,
        offset: (page - 1) * 8,
        order: [['id', 'ASC']],
        include: [
          {
            model: File,
            as: 'avatar',
            attributes: ['id', 'name', 'path', 'url'],
          },
        ],
      });

      if (!deliverymans) {
        return res.status(400).json({ error: 'Deliveryman not found' });
      }

      return res.json(deliverymans);
    }

    const deliverymans = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email'],
      limit: 8,
      offset: (page - 1) * 8,
      order: [['id', 'ASC']],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    if (!deliverymans) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    return res.json(deliverymans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const emailExist = await Deliveryman.findOne({ where: { email } });
    if (emailExist) {
      return res.status(401).json({ error: 'Informed email already exists' });
    }

    const { id, name } = await Deliveryman.create(req.body);

    return res.json({ id, name, email });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;
    const { id } = req.params;

    const deliveryman = await Deliveryman.findByPk(id);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    if (email && email !== deliveryman.email) {
      const emailExist = await Deliveryman.findOne({ where: { email } });

      if (emailExist) {
        return res.status(401).json({ error: 'Informed email already exists' });
      }
    }

    const { name, avatar_id } = await deliveryman.update(req.body);

    return res.json({ id, name, email, avatar_id });
  }

  async delete(req, res) {
    const { id } = req.params;

    const deliverymanExist = await Deliveryman.findByPk(id);
    if (!deliverymanExist) {
      return res.status(400).json({ error: 'Deliveryman not found' });
    }

    await deliverymanExist.destroy();

    return res.status(200).json();
  }
}

export default new DeliverymanController();
