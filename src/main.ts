// src/main.ts
import './controllers/UserController';
import { registerDecoratedControllers } from './core/RegisterControllerDecorator';
import { Router } from './core/router';
import { initDb } from './db/DBModule';

const bootstrap = async () => {
  await initDb(); // Must be called before any repository use

  const router = new Router();
  registerDecoratedControllers(router);
  router.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
  });
};

bootstrap();
