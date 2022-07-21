import { Sequelize_migration } from "db/util/inteface";
import {QueryInterface } from "sequelize";

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.bulkInsert('skill', [
    {
      name: 'goggles crawl on walls',
      description: '',
      strength: 0,
      agility: 1,
      endurance: 0,
      intellect: 0,
    },
    {
      name: 'luck',
      description: '',
      strength: 0,
      agility: 0,
      endurance: 0,
      intellect: 0,
    }
  ]);
};

export const down = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.bulkDelete('skill', {});
}

