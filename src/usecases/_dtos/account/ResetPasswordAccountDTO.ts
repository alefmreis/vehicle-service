import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class ResetPasswordAccountDTO {
  @Expose({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Expose({ name: 'password' })
  @IsNotEmpty()
  @IsString()
  public newPassword: string;

  constructor(email: string, newPassword: string) {
    this.email = email;
    this.newPassword = newPassword;
  }
}

export = ResetPasswordAccountDTO