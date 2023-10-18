import { IsNotEmpty, IsEmail, IsString} from 'class-validator';

export class CreateTeamDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;
}


