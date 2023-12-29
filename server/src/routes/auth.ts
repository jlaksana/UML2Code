import express from 'express';
import {
  getUserByEmail,
  login,
  resetPassword,
  sendPasswordResetEmail,
  sendVerificationEmail,
  signup,
  verifyAccount,
} from '../controllers/authController';
import { getErrorMessage } from '../utils';

const router = express.Router();

/** Logins a user and returns jwt token.
 * @route POST /api/auth/login
 * @access Public
 * @returns {object} 200 - token
 * @returns {Error}  404 - User not found
 * @returns {Error}  404 - Invalid password
 * @returns {Error}  404 - User not verified
 */
router.post('/login', async (req, res) => {
  try {
    const token = await login(req.body.email, req.body.password);
    res.status(200).json({ authToken: token });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/** Signs up a user and sends a verification email.
 * @route POST /api/auth/signup
 * @access Public
 */
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await signup(username, email, password);
    await sendVerificationEmail(user);
    res.status(200).json({ message: 'User created' });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/** Verifies a user's account given a token that was received from the email
 * @route POST /api/auth/verify
 * @access Public
 */
router.post('/verify', async (req, res) => {
  const { token } = req.body;
  console.log(token);
  try {
    await verifyAccount(token);
    res.status(200).json({ message: 'User verified' });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/** Resends a verification email to a user given their email
 * @route GET /api/auth/resend-verification-email/:email
 * @access Public
 * @returns {object} 200 - message
 * @returns {Error}  404 - User not found
 * @returns {Error}  404 - User already verified
 * @returns {Error}  404 - Email not sent
 */
router.get('/resend-verification-email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    await sendVerificationEmail(user);
    res.status(200).json({ message: 'Verification email sent' });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/** Sends a reset password email to a user given their email
 * route GET /api/auth/send-reset-password-email/:email
 * @access Public
 * @returns {object} 200 - message
 * @returns {Error}  404 - User not found
 * @returns {Error}  404 - Email not sent
 */
router.get('/send-reset-password-email/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const user = await getUserByEmail(email);
    await sendPasswordResetEmail(user);
    res.status(200).json({ message: 'Reset password email sent' });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

/** Resets a user's password given a token that was received from the email
 * @route PUT /api/auth/reset-password
 * @access Public
 * @returns {object} 200 - message
 * @returns {Error}  404 - User not found
 * @returns {Error}  404 - Invalid token
 */
router.put('/reset-password', async (req, res) => {
  const { token, password } = req.body;
  try {
    await resetPassword(token, password);
    res.status(200).json({ message: 'Password reset' });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

export default router;
