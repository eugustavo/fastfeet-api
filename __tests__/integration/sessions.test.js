/* eslint-disable no-undef */
import request from 'supertest';

import app from '../../src/app';
import truncate from '../util/truncate';

describe('Session', () => {
  afterAll(async () => {
    await truncate();
  });

  it('it must be possible to create a web session', async () => {
    const response = await request(app)
      .post('/users')
      .send({
        email: 'admin@fastfeet.com',
        password: '123456',
      });

    expect(response.body).toHaveProperty('token');
  });

  it('it must be possible to create a mobile session', async () => {
    const response = await request(app)
      .post('/deliverymansession')
      .send({
        id: 1,
      });

    expect(response.body).toHaveProperty('token');
  });
});
