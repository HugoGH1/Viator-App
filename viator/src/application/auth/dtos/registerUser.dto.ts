import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Trim, Escape } from 'class-sanitizer';

export class RegisterUserDto {
  @IsEmail({}, { message: 'Invalid email format' })
  @IsNotEmpty()
  @Trim()
  @Escape()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: 'La password debe tener al menos 6 caracteres' })
  @Trim()
  @Escape()
  password: string;

  @IsString()
  @IsNotEmpty()
  @Trim()
  @Escape()
  name: string;
}
