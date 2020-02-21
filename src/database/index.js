import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';

import DatabaseConfig from '../config/database';

const models = [User, Recipient];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(DatabaseConfig);

    models.map(model => model.init(this.connection));
  }
}

export default new Database();
