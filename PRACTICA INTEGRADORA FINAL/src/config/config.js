
import dotenv from 'dotenv';
import path from 'path';

const mode = process.env.NODE_ENV || 'developement'

dotenv.config({
  path: path.join(path.resolve(), `.env.${mode}`)
});

const config = {
  server : {
    mode: mode,
    port: process.env.PORT || 8080,
    host: process.env.HOST || 'localhost',
    storageType: process.env.STORAGE_TYPE || 'fs'
  },
  session: {
    secret: process.env.SESSION_SECRET_KEY,
  },
  db : {
    user: process.env.ATLAS_USER,
    pass: process.env.ATLAS_PASS,
    url: process.env.ATLAS_URL,
    dbName: process.env.ATLAS_DBNAME
  },
  admin: {
    email: process.env.ADMIN_EMAIL.toLowerCase(),  //prevents bad usage of .env file
    pass: process.env.ADMIN_PASS
  },

  auth: {
    jwtSecret: process.env.AUTH_JWT_SECRET,
    github: {
      clientId: process.env.AUTH_GITHUB_CLIENT_ID,
      secretKey: process.env.AUTH_GITHUB_SECRET_KEY,
      callbackUrl: process.env.AUTH_GITHUB_CALLBACK_URL
    },
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID,
      secretKey: process.env.AUTH_GOOGLE_SECRET_KEY,
      callbackUrl: process.env.AUTH_GOOGLE_CALLBACK_URL
    }
  },
  mail: {
    user: process.env.GMAIL_USER.toLowerCase(), //prevents bad usage of .env file
    pass: process.env.GMAIL_APP_PASSWORD
  }
}

export {
  config
};


