import * as Joi from 'joi';

export const schema = Joi.object({
  // port должен быть целым числом со значением по умолчанию 3000
  port: Joi.number().integer().default(3000),
  // database это объект с полями для подключения к БД
  database: Joi.object({
    // url должно быть строкой и соответствовать регулярному выражению
    url: Joi.string().pattern(/postgres:\/\/[A-Za-z]/),
    // port должен быть целым числом
    port: Joi.number().integer().default(5432),
    // host должен быть строкой
    host: Joi.string().default('localhost'),
    // username должен быть строкой
    username: Joi.string().default('student'),
    // password должен быть строкой
    password: Joi.string().default('student'),
    // database name должен быть строкой
    name: Joi.string().default('kupipodariday'),
    // synchronize должен быть булевым значением
    synchronize: Joi.boolean().default(false),
  }),
});

export default function configuration() {
  return {
    port: Number.parseInt(process.env.PORT ?? '3000', 10),
    database: {
      url: process.env.DATABASE_URL,
      port: Number.parseInt(process.env.DATABASE_PORT ?? '5432', 10),
      host: process.env.DATABASE_HOST ?? 'localhost',
      username: process.env.DATABASE_USERNAME ?? 'student',
      password: process.env.DATABASE_PASSWORD ?? 'student',
      name: process.env.DATABASE_NAME ?? 'kupipodariday',
      synchronize:
        process.env.NODE_ENV !== 'production' &&
        process.env.DATABASE_SYNCHRONIZE !== 'false',
    },
  };
}
