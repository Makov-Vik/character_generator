import {QueryInterface} from "sequelize";
import {Sequelize_migration} from "../util/inteface";

export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize_migration) => {
  await queryInterface.createTable('character-skill', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    characterId: {
      type: Sequelize.INTEGER,
    },
    skillId: {
      type: Sequelize.INTEGER,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.fn('now')
    },
    updatedAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.fn('now')
    }
  })
};

export const down = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {

  await queryInterface.dropTable('character-skill', { cascade: true });
}
