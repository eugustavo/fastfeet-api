import DeliveryProblem from '../models/DeliveryProblem';

class DeliveryViewProblemController {
  async index(req, res) {
    const problems = await DeliveryProblem.findAll({
      where: { delivery_id: req.params.id },
      attributes: ['id', 'description', 'created_at'],
    });

    return res.json(problems);
  }
}

export default new DeliveryViewProblemController();
