import jwt from 'jsonwebtoken';
import * as Yup from 'yup';

import authConfig from '../../config/auth';

import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanSessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.body;

    const deliveryman = await Deliveryman.findOne({
      where: { id },
      attributes: ['id', 'name', 'email', 'created_at'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'name', 'path', 'url'],
        },
      ],
    });

    if (!deliveryman) {
      return res.status(404).json({ error: 'User not found' });
    }

    // const { name, email, avatar_id } = deliveryman;

    // const avatar = await File.findByPk({ avatar_id });

    return res.json({
      deliveryman,
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new DeliverymanSessionController();
