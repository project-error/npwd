import {
  DataTypes,
  Model,
  Sequelize,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from 'sequelize';

export const PLAYER_IDENITIFER = '1234';

// WIP
export const sequelize = new Sequelize({
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 3308,
  database: '',
});

export class Contact extends Model<InferAttributes<Contact>, InferCreationAttributes<Contact>> {
  declare id: CreationOptional<number>;
  declare display: string;
  declare identifier: string;
  declare number: string;
  declare avatar: string;
}
Contact.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    display: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Contact',
  },
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');

    //await sequelize.sync({ force: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();
