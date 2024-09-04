import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class ResetPasswordAccountDTO {
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public newPassword: string;

  constructor(email: string, newPassword: string) {
    this.email = email;
    this.newPassword = newPassword;
  }
}

export = ResetPasswordAccountDTO