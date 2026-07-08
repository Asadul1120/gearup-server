import { UserStatus } from "../../../generated/prisma/enums.js";

export interface IUpdateUser {
  name?: string;
  phone?: string;
  profileImage?: string;
  address?: string;
}

export interface IUpdateUserStatus {
  status: UserStatus;
}
