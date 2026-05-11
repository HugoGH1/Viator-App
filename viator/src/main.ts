import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';
import helmet from 'helmet';
import { SanitizePipe } from './infrastructure/pipes/sanitize.pipe';
import { PathTraversalGuard } from './common/security/path-traversal.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({ transform: true }),
    new SanitizePipe()
  );
  
  app.useGlobalGuards(new PathTraversalGuard());
  
  app.enableCors({
    origin: "http://localhost:3001",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
