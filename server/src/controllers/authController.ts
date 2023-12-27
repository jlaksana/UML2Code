import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User, UserModel } from '../models/user.model';
import { sendEmail } from './emailService';

const VERIFY = 'verify';
const RESET = 'reset';

/**
 * returns user document given an email
 * @param email email to search for
 * @returns User
 */
const getUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');
  return user;
};

/**
 * Logins a user given an email and password.
 * @param email user's email
 * @param password user's password
 */
const login = async (email: string, password: string) => {
  if (!email || typeof email !== 'string') throw new Error('Invalid email');
  if (!password || typeof password !== 'string')
    throw new Error('Invalid password');

  const user = await UserModel.findOne({ email });
  if (!user) throw new Error('User not found');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid password');

  if (user.verified === false) throw new Error('User not verified');

  const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '7d',
    }
  );
  return token;
};

/**
 * Signs up a user given an email and password
 * @param email user's email
 * @param password user's password
 */
const signup = async (username: string, email: string, password: string) => {
  if (!username || typeof username !== 'string')
    throw new Error('Invalid username');
  if (!email || typeof email !== 'string') throw new Error('Invalid email');
  if (!password || typeof password !== 'string')
    throw new Error('Invalid password');

  const duplicateEmail = await UserModel.findOne({ email });
  if (duplicateEmail)
    throw new Error('An account already exists with this email');

  const duplicateUsername = await UserModel.findOne({ username });
  if (duplicateUsername) throw new Error('Username taken');

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await UserModel.create({
    username,
    email,
    password: hashedPassword,
  });
  return newUser;
};

/**
 * Verifies a user's account given a token that was received from the email
 * @param token token to verify
 */
const verifyAccount = async (token: string) => {
  if (!token || typeof token !== 'string') throw new Error('Invalid token');

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
  if (!decoded || decoded.action !== VERIFY) throw new Error('Invalid token');

  const user = await UserModel.findById(decoded.userId);
  if (!user) throw new Error('User not found');
  if (user.verified === true) throw new Error('User already verified');

  user.verified = true;
  await user.save();
};

/**
 * Sends a verification email to a user given an email
 * @param email user's email
 * @param userId user's id
 */
const sendVerificationEmail = async (user: User) => {
  // create a token that expires in 2 days
  const token = jwt.sign(
    { action: VERIFY, userId: user._id },
    process.env.JWT_SECRET as string,
    {
      expiresIn: '2d',
    }
  );

  const link = `${process.env.CLIENT_URL}/verify/${token}`;

  const templateParams = {
    to: user.email,
    username: user.username,
    htmlLink: `<a href="${link}">Verify your email</a>`,
    link,
  };

  try {
    await sendEmail(
      templateParams,
      process.env.EMAILJS_VERIFY_TEMPLATE_ID as string
    );
  } catch (err) {
    console.log(err);
    throw new Error('Error sending email');
  }
};

export { getUserByEmail, login, sendVerificationEmail, signup, verifyAccount };
