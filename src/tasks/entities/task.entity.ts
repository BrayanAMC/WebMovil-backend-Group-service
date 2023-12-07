import { Entity, Column, PrimaryGeneratedColumn, Unique, Index } from 'typeorm';

@Index(["name", "idCreator"], { unique: true })
@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;
    
    @Column()
    name: string;
    
    @Column()
    description: string;
    
    @Column()
    idCreator: number;
    
    @Column({default: null})
    idResponsible: number;
    
    @Column({default: 'no status'})
    status: string;
    
    @Column()
    startDate: Date;
    
    @Column({default: null})
    endDate: Date;

}

export class CreateTaskResponse {

    success: boolean;


    message: string;


    idTask?: number;
}