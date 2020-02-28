import * as Yup from 'yup';

import Recipient from '../models/Recipient';

class RecipientController {
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

    // const { name } = req.body;
    // const recipient = await Recipient.findOne({ where: { name } });
    // if (recipient) {
    //   return res.json({ error: 'Recipient already exists' });
    // }

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
}

export default new RecipientController();
