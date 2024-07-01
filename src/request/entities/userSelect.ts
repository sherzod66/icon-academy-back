export type TSelectUser = {
  id: number;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
  imagePath: string;
  isAdmin: boolean;
  phoneNumber: string;
};

export const UserSelect = {
  createdAt: true,
  updatedAt: true,
  email: true,
  fullName: true,
  isAdmin: true,
  id: true,
  phoneNumber: true,
  imagePath: true,
};
