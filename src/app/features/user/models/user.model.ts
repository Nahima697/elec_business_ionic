export interface UserRoleDTO {
  id: number;
  name: string;
}

export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  profilePictureUrl: string | null;
  roles: UserRoleDTO[];
}
export interface UserProfileUpdateDto {
  username?: string;
  email?: string;
  profilePictureUrl?: string | null;
}
