import express from 'express';
import response from '../response';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import {
  createUser,
  findResetPasswordTokenUser,
  findUserByEmail,
  updatePassword,
  updateResetPasswordToken,
} from '../models/Users';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookies';
import { authorizationUrl, oauth2Client } from '../utils/loginWithGoogle';
import { google } from 'googleapis';
import { sendResetPasswordLink } from '../helper/sentEmail';

export const signupUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { name, email, password, repassword } = req.body;

    if (!name || !email || !password || !repassword) {
      return response(400, null, 'All fields are required', res);
    }

    // check user was exist or not by email
    const userEmail = await findUserByEmail(email);

    if (userEmail) {
      return response(400, null, 'User already exist', res);
    }

    if (password !== repassword) {
      return response(400, null, `Password doesn't match`, res);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = await createUser({
      name,
      email,
      password: hashedPassword,
    });

    generateTokenAndSetCookie(userData.id, userData.name, res);

    return response(201, userData, 'Register Success!', res);
  } catch (error) {
    console.log(error);
    return response(500, null, 'Server error when signup', res);
  }
};

export const loginUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return response(400, null, 'All fields are required', res);
    }

    const checkToken = req.cookies.token;
    if (checkToken) {
      return response(400, null, 'You have logged in', res);
    }

    const user = await findUserByEmail(email);

    if (!user || !user.password) {
      return response(
        404,
        null,
        'User not found, please create an account',
        res
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user?.password);
    if (!isPasswordValid) {
      return response(400, null, 'Invalid email or password', res);
    }

    const token = generateTokenAndSetCookie(user.id, user.name, res);

    const userData = {
      token,
      userId: user.id,
      email: user.email,
    };

    return response(200, userData, 'Login Success', res);
  } catch (error) {
    console.log(error);
    return response(500, null, 'Server error when user login', res);
  }
};

// Redirect login with Google
export const loginWithGoogle = (
  req: express.Request,
  res: express.Response
) => {
  res.redirect(authorizationUrl);
};

// Login with Google controllers
export const callbackLoginWithGoogle = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code as string);

    oauth2Client.setCredentials(tokens);

    const oaauth2 = google.oauth2({
      auth: oauth2Client,
      version: 'v2',
    });

    const { data } = await oaauth2.userinfo.get();

    if (!data.email) {
      return response(404, data, 'User not found', res);
    }

    const user = await findUserByEmail(data.email);

    let userData;

    if (!user) {
      userData = await createUser({
        name: data.name,
        email: data.email,
        auth_provider: 'GOOGLE',
      });
    } else {
      userData = user;
    }

    generateTokenAndSetCookie(userData.id, userData.name, res);

    const clientURL: string | undefined = process.env.CLIENT_URL;

    if (!clientURL) {
      throw new Error('CLIENT_URL is not defined');
    }

    res.redirect(clientURL);
  } catch (error) {
    console.log(error);
    return response(500, null, 'Server error when login with google', res);
  }
};

export const logoutUser = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    res.clearCookie('token');
    return response(200, null, 'Logout successfully', res);
  } catch (error) {
    console.log(error);
    return response(500, null, 'Server error when user logout', res);
  }
};

export const forgotPassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { email } = req.body;

    if (!email) {
      return response(400, null, 'Email is required', res);
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return response(400, null, 'User not found', res);
    }

    const resetPasswordToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordTokenExpired = new Date(Date.now() + 5 * 60 * 1000);

    const userTokenData = {
      resetPasswordToken,
      resetPasswordTokenExpired,
    };

    const resetPasswordUrl = `${process.env.CLIENT_URL}/reset-password/${resetPasswordToken}`;
    sendResetPasswordLink(user.email, resetPasswordUrl);

    return response(
      200,
      userTokenData,
      'Reset password link has been sent to your email',
      res
    );
  } catch (error) {
    console.log(error);
    return response(
      500,
      null,
      'Server error when user request forgot password',
      res
    );
  }
};

export const resetPassword = async (
  req: express.Request,
  res: express.Response
) => {
  try {
    const { resetPasswordToken } = req.params;
    const { password, rePassword } = req.body;

    if (!password || !rePassword) {
      return response(400, null, 'All fields are required', res);
    }

    const user = await findResetPasswordTokenUser(resetPasswordToken);

    if (!user) {
      return response(400, null, 'Invalid link or user not found', res);
    }

    const currentTime = Date.now();
    if (
      user.resetPasswordTokenExpired &&
      user.resetPasswordTokenExpired.getTime() < currentTime
    ) {
      return response(
        410,
        null,
        'Your link had expire, please request a new one',
        res
      );
    }

    if (password !== rePassword) {
      return response(400, null, `Password doesn't match`, res);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await updateResetPasswordToken(user.id, null, null);
    await updatePassword(user.id, hashedPassword);

    return response(200, user, 'Success reset password', res);
  } catch (error) {
    console.log(error);
    return response(500, null, 'Server error when user reset password', res);
  }
};
