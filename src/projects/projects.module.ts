import { Module } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import {Project} from './entities/project.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamsModule } from 'src/teams/teams.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project]),TeamsModule],
  controllers: [ProjectsController],
  providers: [ProjectsService],

})
export class ProjectsModule {}
