export interface IUser {
  name: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
  address?: string;
}

export interface IUpdateUser {
  name?: string;
  phone?: string;
  profileImage?: string;
  address?: string;
}