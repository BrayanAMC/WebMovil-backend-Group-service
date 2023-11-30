import { IsNotEmpty, IsEmail, IsString, isNotEmpty} from 'class-validator';
export class UpdateProjectDto{
    @IsNotEmpty()
    id: number; 

    @IsString()
    name: string;

    @IsNotEmpty()
    description: string;
}

export class removeTeamDto{
    idProject: number
    idTeam: number
}

