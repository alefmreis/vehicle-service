/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidV4 } from 'uuid';
import bcrypt from 'bcrypt';

import Account from '../../../../src/domain/entities/Account';

jest.mock('bcrypt');
jest.mock('uuid', () => ({ v4: jest.fn() }));

describe('Account Class', () => {
  const mockedUuid = uuidV4();

  beforeEach(() => {
    (bcrypt.hashSync as jest.Mock).mockImplementation((password: string) => `hashed_${password}`);
    (bcrypt.compareSync as jest.Mock).mockImplementation((password: string, hashedPassword: string) => password === hashedPassword.replace('hashed_', ''));
    (uuidV4 as jest.Mock).mockReturnValue(mockedUuid);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a new Account with a hashed password', () => {
    const account = Account.createNew('test@example.com', 'Test User', true, 'password123');

    expect(account.id).toBe(mockedUuid);
    expect(account.email).toBe('test@example.com');
    expect(account.name).toBe('Test User');
    expect(account.isAdmin).toBe(true);
    expect((account as any).password).toBe('hashed_password123');
    expect(bcrypt.hashSync).toHaveBeenCalledWith('password123', 16);
    
    
  });

  it('should create an Account from the database without hashing the password again', () => {
    const account = Account.createFromDatabase('id123', 'test@example.com', 'Test User', false, 'hashed_password123');

    expect(account.id).toBe('id123');
    expect(account.email).toBe('test@example.com');
    expect(account.name).toBe('Test User');
    expect(account.isAdmin).toBe(false);
    expect((account as any).password).toBe('hashed_password123');
    expect(bcrypt.hashSync).not.toHaveBeenCalled();
  });

  it('should verify the correct password using checkPassword', () => {
    const account = Account.createNew('test@example.com', 'Test User', true, 'password123');
  
    expect(account.checkPassword('password123')).toBe(true);
    expect(bcrypt.compareSync).toHaveBeenCalledTimes(1);
  });
  
  it('should return false for an incorrect password using checkPassword', () => {
    const account = Account.createNew('test@example.com', 'Test User', true, 'password123');
  
    expect(account.checkPassword('wrongPassword')).toBe(false);
    expect(bcrypt.compareSync).toHaveBeenCalledTimes(1);
  });

  it('should reset the password with a new hashed one', () => {
    const account = Account.createNew('test@example.com', 'Test User', true, 'password123');

    account.resetPassword('newPassword123');

    expect(bcrypt.hashSync).toHaveBeenCalledWith('newPassword123', 16);
    expect((account as any).password).toBe('hashed_newPassword123');
  });
});
