import { IsNotEmpty, IsEmail, IsString, isNotEmpty} from 'class-validator';
import internal from 'stream';

export class CreateTeamDto {
    
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    description: string;

    
    idCreator: number;
}


