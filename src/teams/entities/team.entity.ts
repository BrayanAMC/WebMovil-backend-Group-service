
import { Entity, Column, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';

@Index(["name", "idCreator"], { unique: true })
@Entity()
export class Team {


    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('int', { array: true, default: [] })
    idMembers: number[];

    @Column()
    idCreator: number;
}


export class CreateTeamResponde {

    success: boolean;


    message: string;


    idTeam?: number;
}

export class AddMemberResponde {

    success: boolean;


    message: string;


    idTeam?: number;
}