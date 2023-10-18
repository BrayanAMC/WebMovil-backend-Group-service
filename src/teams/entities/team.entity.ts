
import { Entity, Column, PrimaryGeneratedColumn , Unique} from 'typeorm';

@Entity()
export class Team {

    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column('int', {array:true, default:[]})
    idMembers: number[];

    @Column()
    idCreator: number;
}


export class TeamResponde {
    
    success: boolean;
  
    
    message: string;
  }
