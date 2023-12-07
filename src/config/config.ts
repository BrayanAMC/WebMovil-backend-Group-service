import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { Team } from 'src/teams/entities/team.entity';
import { Project } from 'src/projects/entities/project.entity';
import { Task } from 'src/tasks/entities/task.entity';

dotenv.config()

const config: TypeOrmModuleOptions = {
  type: 'postgres', // Cambia esto según tu base de datos
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Team, Project, Task], 
  //migrations: [__dirname + '/migrations/*{.ts,.js}'],
  //migrations: ["dist/migrations/**/*{.js,.ts}"],
  synchronize: true, 
  //entities: [__dirname + '/**/*.entity{.ts,.js}'],
};

export default config;
