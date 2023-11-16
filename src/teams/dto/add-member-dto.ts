import { IsNotEmpty, IsEmail, IsString, isNotEmpty} from 'class-validator';
import internal from 'stream';

export class AddMemberDto {
    
    
    @IsString()
    emailNewMember: string;


    idTeam: number;

    
}
