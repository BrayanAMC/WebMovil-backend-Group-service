import { Module } from '@nestjs/common';
import { TeamsModule } from './teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './config/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TeamsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
