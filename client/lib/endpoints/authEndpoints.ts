// server base url
const SERVER_URL = process.env.SERVER_URL;

// BASE URL
const BASE_URL = SERVER_URL + "/api/auth";

// LOGIN ENDPOINT
const authUrl = {
  login: BASE_URL + "/login",
  signup: BASE_URL + "/signup",
  logout: BASE_URL + "/logout",
  sendEmailVerification: BASE_URL + "/email/sendVerification",
  emailVerification: (token: string) => BASE_URL + `/email/verify/${token}`,
  sendResetPassword: BASE_URL + "/password/reset",
  resetPassword: (token: string) => BASE_URL + `/password/reset/${token}`,
};

export default authUrl;
