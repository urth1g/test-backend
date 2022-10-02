import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';

// somewhere in your initialization file

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true,
    },
  });

  app.use(
    session({
      secret:
        'rTtCIvqKpICzMcYS3c2fBXLYsmaIpeea3rddARdVmFX8e5JrLwPMF9SUyeO46mg6',
      resave: false,
      saveUninitialized: false,
    }),
  );
  await app.listen(8000);
}
bootstrap();
