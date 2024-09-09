import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

class LoginDTO {
  @Expose({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Expose({ name: 'password' })
  @IsNotEmpty()
  @IsString()
  public password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}

export = LoginDTO