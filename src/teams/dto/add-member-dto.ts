import { IsNotEmpty, IsEmail, IsString, isNotEmpty} from 'class-validator';
import internal from 'stream';

export class AddMemberDto {
    
    
    @IsNotEmpty()
    idMember: number;//se necesita el idMember para que el team lo agregue a su lista de idMembers 

    @IsString()
    nameTeam: string;//team que se quiere agregar el miembro

    @IsNotEmpty()
    idCreator: number;//para validar que pueda ingresar al nuevo miembro
                     //ya que no deberia agregar miebros a teams de otros usuarios.
}
