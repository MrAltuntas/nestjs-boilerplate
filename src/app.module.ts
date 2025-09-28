import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_PIPE } from '@nestjs/core';
import { TodoModule } from './Modules/todo/todo.module';
import { PrismaModule } from './Modules/prisma/prisma.module';
import { HealthModule } from './Modules/health/health.module';

@Module({
  imports: [
    // Environment variables yükleme
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TodoModule,
    PrismaModule,
    HealthModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
