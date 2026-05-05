import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @IsEmail({}, { message: 'Ingresa un email válido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Ingresa una contraseña' })
  password: string;
}
