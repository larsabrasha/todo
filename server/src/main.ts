import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express = require('express');
import bodyParser = require('body-parser');

async function bootstrap() {
  const instance: express.Express = express();
  instance.use(bodyParser.text());
  instance.use(bodyParser.json());

  const app = await NestFactory.create(AppModule, instance);
  await app.listen(3000);
}
bootstrap();
