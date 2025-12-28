export interface UserProfileDto {
  id: string;
  username: string;
  email: string;
  profilePictureUrl?: string;
  addressLine?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  roles?: any[];
}
