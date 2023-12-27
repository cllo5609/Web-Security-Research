/*
 * Copyright (c) 2014-2023 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 * 
 * Modifications by Holden Chen | Oregon State University 2023
*/

import { type Request, type Response, type NextFunction } from 'express'
import { UserModel } from '../models/user'
import jwt from 'jsonwebtoken'
import { decode } from 'punycode'

const security = require('../lib/insecurity')
const cache = require('../data/datacache')

module.exports = function changePasswordSecure() {
    return ({ query, headers, connection }: Request, res: Response, next: NextFunction) => {
      const newPassword = query.new;
      const newPasswordInString = newPassword?.toString();
      const repeatPassword = query.repeat;
      const token = query.token; // Get the JWT from the query parameter
  
      if (!newPassword || newPassword === 'undefined') {
        res.status(401).send(res.__('Password cannot be empty.'));
      } else if (newPassword !== repeatPassword) {
        res.status(401).send(res.__('New and repeated password do not match.'));
      } else if (typeof token === 'string') {
          try {
            const secret = "GOBEAV$$!!"
            jwt.verify(token, secret, (err, decoded) => {
              if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(401).send('Invalid or expired token. Error details: ' + err.message);
              }
              const userId = typeof decoded === 'object' ? decoded.userId : null;
              UserModel.findByPk(userId).then((user: UserModel | null) => {
                if (user) {
                  user.update({ password: newPasswordInString }).then((user: UserModel) => {
                    res.json({ user });
                  }).catch((error: Error) => {
                    next(error);
                  });
                } else {
                  res.status(404).send('User not found.');
                }
              }).catch((error: Error) => {
                next(error);
              });
            });
          } catch (error) {
            console.error("JWT Verification Error:", error);
            res.status(401).send('Invalid or expired token.');
          }
      } else {
        res.status(401).send('Token is not provided or is not a valid string.');
      }
    };
  };
  
