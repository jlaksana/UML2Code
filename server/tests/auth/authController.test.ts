import jwt from 'jsonwebtoken';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { ConnectOptions } from 'mongoose';
import {
  login,
  resetPassword,
  signup,
  verifyAccount,
} from '../../src/controllers/authController';
import { User, UserModel } from '../../src/models/user.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // create a new in-memory database before running any tests
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions);
});

afterAll(async () => {
  // clear all test data after all tests
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('signup', () => {
  afterAll(async () => {
    await UserModel.deleteMany({});
  });

  it('should be able to create a new user', async () => {
    const user = await signup('user1', 'test@email.com', 'password');
    expect(user).toBeDefined();
    expect(user._id).toBeDefined();
    expect(user.username).toBe('user1');
    expect(user.email).toBe('test@email.com');
  });

  it('should throw an error if the parameters are empty', async () => {
    await expect(signup('', '', 'password')).rejects.toThrow(
      'Invalid username'
    );
    await expect(signup('user2', '', 'password')).rejects.toThrow(
      'Invalid email'
    );
    await expect(signup('user3', 'testemail.com', '')).rejects.toThrow(
      'Invalid password'
    );
  });

  it('should throw an error if the email is already taken', async () => {
    await expect(signup('user4', 'test@email.com', 'password')).rejects.toThrow(
      'An account already exists with this email'
    );
  });

  it('should throw an error if the username is already taken', async () => {
    await expect(
      signup('user1', 'test2@email.com', 'password')
    ).rejects.toThrow('Username taken');
  });
});

describe('login', () => {
  beforeAll(async () => {
    const user = await signup('user5', 'test@email.com', 'password');
    await UserModel.findByIdAndUpdate(user._id, { verified: true });
    await signup('user6', 'test2@email.com', 'password');
  });

  afterAll(async () => {
    await UserModel.deleteMany({});
  });

  it('should be able to login verified a user', async () => {
    const user = await login('test@email.com', 'password');
    expect(user).toBeDefined();
    expect(user.userId).toBeDefined();
    expect(user.username).toBe('user5');
    expect(user.authToken).toBeDefined();
  });

  it('should throw an error if the parameters are empty', async () => {
    await expect(login('', 'password')).rejects.toThrow('Invalid email');
    await expect(login('user5', '')).rejects.toThrow('Invalid password');
  });

  it('should throw an error if the user is not verified', async () => {
    await expect(login('test2@email.com', 'password')).rejects.toThrow(
      'User not verified'
    );
  });
});

describe('verification flow', () => {
  afterAll(async () => {
    await UserModel.deleteMany({});
  });
  let user: User;
  beforeAll(async () => {
    const u = await signup('user7', 'test@email.com', 'password');
    user = u;
  });
  afterAll(async () => {
    await UserModel.deleteMany({});
  });

  it('should throw an error if the token is invalid', async () => {
    await expect(verifyAccount('invalid')).rejects.toThrow(
      'Invalid or expired token'
    );
  });

  it('should verify with a valid token', async () => {
    const token = jwt.sign(
      { userId: user._id, action: 'verify' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7hr' }
    );
    await verifyAccount(token);
    const verifiedUser = await UserModel.findById(user._id);
    expect(verifiedUser).toBeDefined();
    expect(verifiedUser?.verified).toBe(true);
  });

  it('should throw an error if the user is already verified', async () => {
    const token = jwt.sign(
      { userId: user._id, action: 'verify' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7hr' }
    );
    await expect(verifyAccount(token)).rejects.toThrow('User already verified');
  });

  it('should throw an error if type of token is invalid', async () => {
    const token = jwt.sign(
      { userId: user._id, action: 'invalid' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7hr' }
    );
    await expect(verifyAccount(token)).rejects.toThrow('Invalid token');
  });
});

describe('reset password flow', () => {
  afterAll(async () => {
    await UserModel.deleteMany({});
  });
  let user: User;
  beforeAll(async () => {
    const u = await signup('user8', 'test@email.com', 'password');
    user = u;
  });
  afterAll(async () => {
    await UserModel.deleteMany({});
  });

  it('successfully resets the password', async () => {
    const token = jwt.sign(
      { userId: user._id, action: 'reset' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7hr' }
    );
    await resetPassword(token, 'newpassword');
    const updatedUser = await UserModel.findById(user._id);
    expect(updatedUser).toBeDefined();
    expect(updatedUser?.password).not.toBe(user.password);
  });

  it('should throw an error if type of token is invalid', async () => {
    const token = jwt.sign(
      { userId: user._id, action: 'invalid' },
      process.env.JWT_SECRET as string,
      { expiresIn: '7hr' }
    );
    await expect(resetPassword(token, 'password')).rejects.toThrow(
      'Invalid token'
    );
  });
});
