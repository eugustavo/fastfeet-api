import Mail from '../../lib/Mail';

class CancellationMail {
  get key() {
    return 'CancellationMail';
  }

  async handle({ data }) {
    const { delivery, deliveryman, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Uma entrega foi cancelada',
      template: 'cancellationMail',
      context: {
        deliveryman: deliveryman.name,
        product: delivery.product,
        recipient_name: recipient.name,
        recipient_street: recipient.street,
        recipient_streetNumber: recipient.street_number,
        recipient_complement: recipient.complement,
        recipient_city: recipient.city,
        recipient_state: recipient.state,
        recipient_zipcode: recipient.zipcode,
      },
    });
  }
}

export default new CancellationMail();
