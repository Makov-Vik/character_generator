import { Sequelize_migration } from "db/util/inteface";
import {QueryInterface} from "sequelize";

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.bulkInsert('subject', [
    {
      name: 'power stone',
      description: '',
      strength: 3,
      agility: 0,
      endurance: 0,
      intellect: 0,
    },
    {
      name: "koshchei glasses",
      description: '',
      strength: 0,
      agility: 0,
      endurance: 0,
      intellect: 3,
    }
  ]);
};

export const down = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.bulkDelete('subject', {})
}

