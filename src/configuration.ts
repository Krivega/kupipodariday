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
  // jwt_secret для подписи JWT, обязателен для auth
  jwt_secret: Joi.string(),
  // jwt_expires_in — время жизни access token (например: 15m, 1h, 7d)
  jwt_expires_in: Joi.string().default('7d'),
  // cors.origins — разрешённые origin для CORS (список через запятую в CORS_ORIGINS)
  cors: Joi.object({
    origins: Joi.array()
      .items(Joi.string())
      .default(['http://localhost:3000', 'http://127.0.0.1:3000']),
  }).default(),
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
    jwt_secret: process.env.JWT_SECRET,
    jwt_expires_in: process.env.JWT_EXPIRES_IN ?? '7d',
    cors: {
      origins:
        process.env.CORS_ORIGINS === undefined
          ? ['http://localhost:3000', 'http://127.0.0.1:3000']
          : process.env.CORS_ORIGINS.split(',')
              .map((s) => {
                return s.trim();
              })
              .filter(Boolean),
    },
  };
}
