import Mail from '../../lib/Mail';

class NotificationOrder {
  get key() {
    return 'NotificationOrder';
  }

  async handle({ data }) {
    const { deliveryman, product, recipient } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: 'Nova entrega cadastrada para você',
      template: 'notificationOrder',
      context: {
        deliveryman: deliveryman.name,
        product,
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

export default new NotificationOrder();
