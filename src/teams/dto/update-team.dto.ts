import { IsNotEmpty, IsEmail, IsString, isNotEmpty} from 'class-validator';
export class UpdateTeamDto{
    @IsNotEmpty()
    id: number; 

    @IsString()
    name: string;

    @IsNotEmpty()
    description: string;
}
