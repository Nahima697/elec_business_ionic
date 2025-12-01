export interface UserRoleDTO {
  id: number;
  name: string;
}

export interface UserDTO {
  id: string;
  email: string;
  username: string;
  emailVerified: boolean;
  roles: UserRoleDTO[];
}

export interface AuthResponse {
  token: string;
  user: UserDTO;
  emailVerificationRequired: boolean;
}
