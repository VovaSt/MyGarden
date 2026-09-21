import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GardensModule } from './gardens/gardens.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, GardensModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
