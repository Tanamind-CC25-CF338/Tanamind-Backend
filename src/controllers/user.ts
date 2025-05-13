import express from 'express';
import response from '../response';
import bcrypt from 'bcrypt';
import { createUser, findUserByEmail } from '../models/Users';
import { generateTokenAndSetCookie } from '../utils/generateTokenAndSetCookies';

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
