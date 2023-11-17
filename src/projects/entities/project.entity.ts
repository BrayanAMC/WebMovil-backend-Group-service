import { Entity, Column, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';

@Index(["name", "idCreator"], { unique: true })
@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('int', { array: true, default: [] })
    idTeams: number[];

    @Column()
    idCreator: number;
}

export class CreateProjectResponse {

    success: boolean;


    message: string;


    idProject?: number;
}

export class AddTeamResponse {

    success: boolean;


    message: string;


    idTeam?: number;
}
