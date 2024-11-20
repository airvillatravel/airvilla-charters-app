export interface UserProfileResType {
  success: boolean;
  message: string;
  results?: UserProfileResultType;
  validationError?: { [key: string]: string };
}

export interface UserAddressResultType {
  id: string;
  country: string;
  city: string;
  street?: string;
}

export interface UserProfileResultType {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  agencyName: string;
  email: string;
  hashedPassword: string;
  nationality: string;
  dateOfBirth: string;
  gender: string;
  logo?: string;
  accountStatus: string;
  role: string;
  addressId: string;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
  address: UserAddressResultType;
  iataNo?: string;
  commercialOperationNo?: string;
  phoneNumber: string;
  phoneNumberVerified: boolean;
  website?: string;
}
