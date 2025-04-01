import { UserRole, UserStatus } from "@prisma/client";

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  password: string;
  avatar?: string;
}

export interface IUserCreate {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IUpdateUser {
  firstName: string;
  lastName?: string;
  mobile?: string;
  avatar?: string;
  role?: UserRole;
  status?: UserStatus;
}
