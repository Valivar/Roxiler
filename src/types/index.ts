
export enum UserRole {
  ADMIN = "ADMIN",
  NORMAL = "NORMAL",
  STORE_OWNER = "STORE_OWNER"
}

export interface User {
  id: string;
  name: string;
  email: string;
  address: string;
  role: UserRole;
  storeId?: string; // If the user is a store owner
}

export interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  ownerId: string;
  averageRating: number;
}

export interface Rating {
  id: string;
  storeId: string;
  userId: string;
  value: number;
  userName?: string; // For display purposes
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  address: string;
}
