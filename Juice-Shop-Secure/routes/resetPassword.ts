/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */

/*
 * Modifications by Holden Chen - Oregon State University 2023
 */

import config from 'config'
import { type Request, type Response, type NextFunction } from 'express'
import { UserModel } from '../models/user'

// BEGIN Imports for Broken Authentication patch
import jwt from 'jsonwebtoken'
import { environment } from '../frontend/src/environments/environment'
const nodemailer = require('nodemailer')
// END Imports for Broken Authentication patch

module.exports = function resetPassword() {
  return async ({ body }: Request, res: Response) => {
    const email = body;
    const user = await verifyUserByEmail(email);

    if (user) {
      const token = createToken(user.id);
      const resetUrl = `http://localhost:3000/#/change-password-secure/?token=${token}`;
      await sendResetEmail(email, resetUrl);
    }

    res.json({ message: 'If your email is registered, you will receive a password reset link.' });
  };
};

// BEGIN: Helper functions for Broken Authentication patch
// -------------------------------------------
// Verifies the User given email
async function verifyUserByEmail(email: string) {
  try {
    return await UserModel.findOne({ where: { email: `${email}` } });
  } catch (error) {
    console.error('Error in verifying user:', error);
    throw error;
  }
}

// use crypto module and jwt to create unique token to be included in the URL
const createToken = (userId: number) => {
  const secret = "GOBEAV$$!!"
  return jwt.sign({ userId }, secret, { expiresIn: 900 }); // 15 min
};

// Send the Reset Password email to the user
async function sendResetEmail(email: string, resetUrl: string) {
  // Set up Nodemailer transporter
  // Using MailTrap for testing purposes only. NOT FOR PRODUCTION
  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: environment.mailTrapUser,
      pass: environment.mailTrapPass
    }
  });
  
  // Send email
  try {
    const info = await transporter.sendMail({
      from: '"OWASP Juice Shop" <support@juice-sh.op>', // sender address
      to: email, // receiver (user's email)
      subject: "Password Reset", // Subject line
      text: `To reset your password, please click the following link: ${resetUrl}`, // plain text body
      html: `<p>To reset your password, please click the following link: <a href="${resetUrl}">${resetUrl}</a></p>`, // HTML body
    });

    console.log("Password reset email sent: %s", info.messageId);
  } catch (error) {
    console.error('Error sending reset email:', error);
    throw error;
  }
}
// END: Helper functions for Broken Authentication patch
// -------------------------------------------