import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';
import { emailRegexp } from 'src/constans/users';

export class UserLoginDto {
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(emailRegexp, {
    message: 'Email does not match the required pattern',
  })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
