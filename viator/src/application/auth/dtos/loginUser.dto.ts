import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Trim, Escape } from 'class-sanitizer';

export class LoginUserDto {
  @IsEmail({}, { message: 'Ingresa un email válido' })
  @IsNotEmpty()
  @Trim()
  @Escape()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Ingresa una contraseña' })
  @Trim()
  @Escape()
  password: string;
}
