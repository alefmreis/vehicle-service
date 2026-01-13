import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

class ResetPasswordAccountDTO {
  @Expose({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Expose({ name: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  public newPassword: string;

  constructor(email: string, newPassword: string) {
    this.email = email;
    this.newPassword = newPassword;
  }
}

export = ResetPasswordAccountDTO