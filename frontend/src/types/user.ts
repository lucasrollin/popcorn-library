export interface User {
  id: string;
  email: string;
  username: string;
  avatar: string | null;
}

export interface PublicProfile {
  id: string;
  username: string;
  avatar: string | null;
  createdAt: string;
}
