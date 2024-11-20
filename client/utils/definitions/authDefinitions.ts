// AUTH DEFINITIONS

// LOGIN BODY
export interface LoginBody {
  email: string;
  password: string;
}

// USER INFO
export interface UserInfo {
  id?: string;
  firstName?: string;
  lastName?: string;
  agencyName?: string | null;
  email?: string;
  username?: string;
  role?: string;
  avatar?: string | null;
  accountStatus?: string;
  verified?: boolean;
  createdAt: string;
  updatedAt: string;
}

// local USER
export interface StoredUser extends UserInfo {
  isLogin: boolean;
}

// LOGOUT RES
export interface LogoutResponse {
  success: boolean;
  message: string;
}

// SIGNUP FORM DATA
export interface SignupFormDataTypes {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  nationality?: string;
  dateOfBirth?: string;
  gender?: string;
  country: string;
  city: string;
  street: string;
  role: string;
  iataNo?: string;
  commercialOperationNo?: string;
  agencyName?: string | null;
  phoneNumber: string;
  website?: string;
}

// LOGIN RES
export interface AuthResTypes {
  success: boolean;
  message: string;
  validationErrors?: string[];
  results?: UserInfo;
}
