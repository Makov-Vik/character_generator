import { Sequelize_migration } from "db/util/inteface";
import {QueryInterface} from "sequelize";

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.bulkInsert('clothes', [
    {
      name: 'teeshirt',
      description: '',
      strength: 0,
      agility: 1,
      endurance: 2,
      intellect: 0,
    },
    {
      name: 'chain armor',
      description: '',
      strength: 2,
      agility: 0,
      endurance: -1,
      intellect: 0,
    }
  ]);
};

export const down = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.bulkDelete('clothes', {});
}

