export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  joinDate?: string;
  avatar?: string;
}

export interface ProfileMenuItem {
  icon: string;
  label: string;
  action: string;
}
