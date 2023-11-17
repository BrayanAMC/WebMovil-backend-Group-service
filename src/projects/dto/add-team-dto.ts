import { IsNotEmpty, IsEmail, IsString, isNotEmpty} from 'class-validator';
export class AddTeamDto {
    
    @IsString()
    nameNewTeam: string;


    idProject: number;

    
}