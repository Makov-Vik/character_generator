import {QueryInterface} from "sequelize";
import {Sequelize_migration} from "../util/inteface";


export const up = async (queryInterface: QueryInterface, Sequelize: Sequelize_migration) => {
  await queryInterface.createTable('character', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: Sequelize.INTEGER,
      references: {
        model: 'user',
        key: 'id'
      },
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    pathPhoto: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    strength: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    agility: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    endurance: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    intellect: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    clothes: {
      type: Sequelize.INTEGER
    },
    skills: {
      type: Sequelize.INTEGER
    },
    subjects: {
      type: Sequelize.INTEGER
    },
    openedClothes: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    openedSkills: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    openedSubjects: {
      type: Sequelize.ARRAY(Sequelize.INTEGER),
    },
    meleeDamage: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    rangedDamage: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    protection: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    magicDamage: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    healthPoint: {
      type: Sequelize.INTEGER,
      defaultValue: 0
    },
    magicPoint: {
      type: Sequelize.INTEGER,
      defaultValue: 0
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
  await queryInterface.dropTable('character', {});
}
