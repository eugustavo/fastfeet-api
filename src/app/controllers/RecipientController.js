import * as Yup from 'yup';
import { Op } from 'sequelize';

import Recipient from '../models/Recipient';

class RecipientController {
  async index(req, res) {
    const { page, findRecipient } = req.query;

    if (findRecipient) {
      const recipient = await Recipient.findAll({
        where: {
          name: {
            [Op.iLike]: `%${findRecipient}%`,
          },
        },
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
        limit: 8,
        offset: (page - 1) * 8,
        order: [['id', 'ASC']],
      });

      if (!recipient) {
        return res.status(400).json({ error: 'Recipient not found' });
      }

      return res.json(recipient);
    }

    const recipient = await Recipient.findAll({
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
      limit: 8,
      offset: (page - 1) * 8,
      order: [['id', 'ASC']],
    });

    if (!recipient) {
      return res.status(400).json({ error: 'Recipient not found' });
    }

    return res.json(recipient);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      street: Yup.string().required(),
      street_number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const {
      name,
      street,
      street_number,
      complement,
      state,
      city,
      zipcode,
    } = await Recipient.create(req.body);

    return res.json({
      name,
      adrress: {
        street,
        street_number,
        complement,
        state,
        city,
        zipcode,
      },
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      street: Yup.string(),
      street_number: Yup.number(),
      complement: Yup.string(),
      state: Yup.string(),
      city: Yup.string(),
      zipcode: Yup.string(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;
    const recipient = await Recipient.findByPk(id);
    if (!recipient) {
      return res.json({ error: 'Recipient not found' });
    }

    const {
      name,
      street,
      street_number,
      complement,
      state,
      city,
      zipcode,
    } = await recipient.update(req.body);

    return res.json({
      name,
      adrress: {
        street,
        street_number,
        complement,
        state,
        city,
        zipcode,
      },
    });
  }

  async delete(req, res) {
    const { id } = req.params;

    const recipient = await Recipient.findByPk(id);
    if (!recipient) {
      return res.status(400).json({ error: 'Order not found' });
    }

    recipient.destroy();
    recipient.save();

    return res.status(200).json();
  }
}

export default new RecipientController();
