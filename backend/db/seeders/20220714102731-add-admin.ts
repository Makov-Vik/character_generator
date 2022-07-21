import { Sequelize_migration } from "../util/inteface";
import {QueryInterface} from "sequelize";
import { ROLE } from "../../src/constants";
import * as bcrypt from 'bcryptjs';
import * as env from 'env-var';
import * as dotenv from 'dotenv';
dotenv.config();

const ENCODING_SALT = env.get('ENCODING_SALT').required().asIntPositive();

const preparePassword = async (inputPassword: string) => {
  return await bcrypt.hash(inputPassword, ENCODING_SALT);
}

export const up = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
    await queryInterface.bulkInsert('user', [{
      name: env.get('ADMIN_NAME').required().asString(),
      email: env.get('ADMIN_EMAIL').required().asString(),
      password: await preparePassword(env.get('ADMIN_PASSWORD').required().asString()),
      roleId: ROLE.ADMIN,
    }]);
  };

export const down = async (queryInterface: QueryInterface, _Sequelize: Sequelize_migration) => {
  await queryInterface.bulkDelete('user', {})
}

