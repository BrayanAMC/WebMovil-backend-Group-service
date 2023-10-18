import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TeamsModule } from './teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TeamsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
