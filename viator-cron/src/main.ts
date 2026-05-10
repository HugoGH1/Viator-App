import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import '@js-temporal/polyfill';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3002);
  console.log(`Server cron is running on: ', ${await app.getUrl()}`);
}
bootstrap();
