import { DataType } from 'sequelize-typescript';

const PRIMARY_KEY = {
  type: DataType.INTEGER,
  unique: true,
  autoIncrement: true,
  primaryKey: true,
};

enum ROLE {
  ADMIN = 1,
  PLAYER = 2,
}

const clothesTable: Things = {
  thing: 'clothes',
  openedThing: 'openedClothes',
};
const skillTable: Things = {
  thing: 'skills',
  openedThing: 'openedSkills',
};
const subjectTable: Things = {
  thing: 'subjects',
  openedThing: 'openedSubjects',
};

export { PRIMARY_KEY, ROLE, clothesTable, skillTable, subjectTable };
