export interface UserDocument {
  _id: string;
  name: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  password: string;
  likedAccommodations: string[];
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
  getResetPasswordToken(): string;
  save(): Promise<UserDocument>;
}
