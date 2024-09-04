import Account from '../entities/Account';

interface IAccountRepository {
  getByEmail(email: string): Promise<Account | null>;
  create(account: Account): void
  update(account: Account): void
}

export = IAccountRepository