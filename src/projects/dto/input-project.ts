import { IsNotEmpty, IsEmail, IsString, isNotEmpty} from 'class-validator';
import internal from 'stream';

export class findProjectByIdInput {


    @IsNotEmpty()
    idCreator: number;


}