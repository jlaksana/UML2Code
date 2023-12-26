import express from 'express';
import {
  getUserByEmail,
  login,
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
  try {
    await verifyAccount(token);
    res.status(200).json({ message: 'User verified' });
  } catch (e) {
    res.status(404).json({ message: getErrorMessage(e) });
    console.log(getErrorMessage(e));
  }
});

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

// TODO: add forgot password route

export default router;
