# backend for character generator

## What is it ?
Your attention is presented to the development of backend software for the organization of airsoft teams. This includes CRUD operations for the team and users, an interface for the manager and administrator, the ability to register and receive notifications, and much more, which is described below.

### Migration
The administrator is created before starting the server. So define correct admin details in **.development.env** file
To run a create table migration, use:
```
npx sequelize-cli db:migrate
```
to drop all tables, use:
```
npx sequelize-cli db:migrate:undo:all
```

To populate the table of roles, run
```
npx sequelize-cli db:seed:all
```
to clear the table of roles:
```
npx sequelize-cli db:seed:undo:all
```

*If you failed to make seeders on the first try, then you should eliminate it and recreate the database. Because when inserting into tables, a specific id is used, which violates the uniqueness value on subsequent insert attempts. An error similar to this might appear: ERROR: Duplicate key value violates the "role_pkey" unique constraint. Then recreate the database and run migration and seeders again.*


# Run
You need to change the type of the handleRequest method in the AuthGuard declaration in node_modules to
```
handleRequest<TUser = any>(err: any, user: any, info: any, context: any, status?: any): User;
```