import {Sequelize_migration} from "../util/inteface";
import {QueryInterface} from "sequelize";

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.addConstraint('character', {
    fields: ['clothes'],
    type: 'foreign key',
    name: 'fkey_to_character_clothes',
    references: {
      table: 'character-clothes',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
  await queryInterface.addConstraint('clothes', {
    fields: ['characters'],
    type: 'foreign key',
    name: 'fkey_to_character_clothes',
    references: {
      table: 'character-clothes',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  await queryInterface.addConstraint('character', {
    fields: ['subjects'],
    type: 'foreign key',
    name: 'fkey_to_character_subject',
    references: {
      table: 'character-subject',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
  await queryInterface.addConstraint('subject', {
    fields: ['characters'],
    type: 'foreign key',
    name: 'fkey_to_character_subject',
    references: {
      table: 'character-subject',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  await queryInterface.addConstraint('character', {
    fields: ['skills'],
    type: 'foreign key',
    name: 'fkey_to_character_skill',
    references: {
      table: 'character-skill',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });

  await queryInterface.addConstraint('skill', {
    fields: ['characters'],
    type: 'foreign key',
    name: 'fkey_to_character_skill',
    references: {
      table: 'character-skill',
      field: 'id'
    },
    onDelete: 'cascade',
    onUpdate: 'cascade'
  });
}

export const down = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.dropTable('skill', {});
  await queryInterface.dropTable('subject', {});
  await queryInterface.dropTable('clothes', {});
}

