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
