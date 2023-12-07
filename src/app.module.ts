import { Module } from '@nestjs/common';
import { TeamsModule } from './teams/teams.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import config from './config/config';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    TeamsModule,
    ProjectsModule,
    TasksModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
