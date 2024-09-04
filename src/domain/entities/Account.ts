import bycript from 'bcrypt';

import { v4 as uuidV4 } from 'uuid';

class Account {
  public readonly id: string;
  public readonly email: string;
  public name: string;
  public readonly isAdmin: boolean;
  private password: string;

  private constructor(id: string, email: string, name: string, isAdmin: boolean, password: string) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.isAdmin = isAdmin;
    this.password = password;
  }

  public static createNew(email: string, name: string, isAdmin: boolean, password: string): Account {
    password = bycript.hashSync(password, 16);

    return new Account(uuidV4(), email, name, isAdmin, password);
  }

  public static createFromDatabase(id: string, email: string, name: string, isAdmin: boolean, password: string): Account {
    return new Account(id, email, name, isAdmin, password);
  }

  public checkPassword(password: string): boolean {
    if (!bycript.compareSync(password, this.password)) {
      return false;
    }

    return true;
  }

  public resetPassword(newPassword: string) {
    this.password = bycript.hashSync(newPassword, 16);
  }
}

export = Account
