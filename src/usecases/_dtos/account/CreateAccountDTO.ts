import { Expose } from 'class-transformer';
import { IsBoolean, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

class CreateAccountDTO {
  @Expose({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  public email: string;

  @Expose({ name: 'isAdmin' })
  @IsNotEmpty()
  @IsBoolean()
  public isAdmin: boolean;

  @Expose({ name: 'name' })
  @IsNotEmpty()
  @IsString()
  public name: string;

  @Expose({ name: 'password' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  public password: string;

  constructor(name: string, email: string, isAdmin: boolean, password: string) {
    this.email = email;
    this.isAdmin = isAdmin;
    this.name = name;
    this.password = password;
  }
}

export = CreateAccountDTO