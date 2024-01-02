"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccount = exports.signup = exports.sendVerificationEmail = exports.sendPasswordResetEmail = exports.resetPassword = exports.login = exports.getUserByEmail = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = require("../models/user.model");
const emailService_1 = require("./emailService");
const VERIFY = 'verify';
const RESET = 'reset';
const AUTH = 'auth';
/**
 * returns user document given an email
 * @param email email to search for
 * @returns User
 */
const getUserByEmail = async (email) => {
    const user = await user_model_1.UserModel.findOne({ email });
    if (!user)
        throw new Error('User not found');
    return user;
};
exports.getUserByEmail = getUserByEmail;
/**
 * Logins a user given an email and password.
 * @param email user's email
 * @param password user's password
 */
const login = async (email, password) => {
    if (!email || typeof email !== 'string')
        throw new Error('Invalid email');
    if (!password || typeof password !== 'string')
        throw new Error('Invalid password');
    const user = await user_model_1.UserModel.findOne({ email });
    if (!user)
        throw new Error('User not found');
    const match = await bcrypt_1.default.compare(password, user.password);
    if (!match)
        throw new Error('Invalid password');
    if (user.verified === false)
        throw new Error('User not verified');
    const token = jsonwebtoken_1.default.sign({ type: AUTH, userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    return { userId: user._id, username: user.username, authToken: token };
};
exports.login = login;
/**
 * Signs up a user given an email and password
 * @param email user's email
 * @param password user's password
 */
const signup = async (username, email, password) => {
    if (!username || typeof username !== 'string')
        throw new Error('Invalid username');
    if (!email || typeof email !== 'string')
        throw new Error('Invalid email');
    if (!password || typeof password !== 'string')
        throw new Error('Invalid password');
    const duplicateEmail = await user_model_1.UserModel.findOne({ email });
    if (duplicateEmail)
        throw new Error('An account already exists with this email');
    const duplicateUsername = await user_model_1.UserModel.findOne({ username });
    if (duplicateUsername)
        throw new Error('Username taken');
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const newUser = await user_model_1.UserModel.create({
        username,
        email,
        password: hashedPassword,
    });
    return newUser;
};
exports.signup = signup;
/**
 * Verifies a user's account given a token that was received from the email
 * @param token token to verify
 */
const verifyAccount = async (token) => {
    if (!token || typeof token !== 'string')
        throw new Error('Invalid token');
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    }
    catch (err) {
        throw new Error('Invalid or expired token');
    }
    if (!decoded || decoded.action !== VERIFY)
        throw new Error('Invalid token');
    const user = await user_model_1.UserModel.findById(decoded.userId);
    if (!user)
        throw new Error('User not found');
    if (user.verified === true)
        throw new Error('User already verified');
    user.verified = true;
    await user.save();
};
exports.verifyAccount = verifyAccount;
/**
 * Sends a verification email to a user given an email
 * @param email user's email
 * @param userId user's id
 */
const sendVerificationEmail = async (user) => {
    // create a token that expires in 2 days
    const token = jsonwebtoken_1.default.sign({ action: VERIFY, userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '2d',
    });
    const link = `${process.env.CLIENT_URL}/verify?token=${token}`;
    const templateParams = {
        to: user.email,
        username: user.username,
        htmlLink: `<a href="${link}">Verify your email</a>`,
        link,
    };
    try {
        await (0, emailService_1.sendEmail)(templateParams, process.env.EMAILJS_VERIFY_TEMPLATE_ID);
    }
    catch (err) {
        console.log(err);
        throw new Error('Error sending email');
    }
};
exports.sendVerificationEmail = sendVerificationEmail;
/**
 * Sends a password reset email to a user given an email
 * @param user User document
 */
const sendPasswordResetEmail = async (user) => {
    // create a token that expires in 2 days
    const token = jsonwebtoken_1.default.sign({ action: RESET, userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    const link = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
    const templateParams = {
        to: user.email,
        htmlLink: `<a href="${link}">Reset your password</a>`,
        link,
    };
    try {
        await (0, emailService_1.sendEmail)(templateParams, process.env.EMAILJS_RESET_TEMPLATE_ID);
    }
    catch (err) {
        console.log(err);
        throw new Error('Error sending email');
    }
};
exports.sendPasswordResetEmail = sendPasswordResetEmail;
/**
 * Changes the user's password given a token and new password
 * @param token token to verify given in email
 * @param password new password to set
 */
const resetPassword = async (token, password) => {
    if (!token || typeof token !== 'string')
        throw new Error('Invalid token');
    if (!password || typeof password !== 'string')
        throw new Error('Invalid password');
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    if (!decoded || decoded.action !== RESET)
        throw new Error('Invalid token');
    const user = await user_model_1.UserModel.findById(decoded.userId);
    if (!user)
        throw new Error('User not found');
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    user.password = hashedPassword;
    await user.save();
};
exports.resetPassword = resetPassword;
//# sourceMappingURL=authController.js.map