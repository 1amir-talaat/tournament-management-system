import { DataTypes } from 'sequelize';
import sequelize from '../database/connection.js';

const Role = sequelize.define('Role', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

export default Role;
