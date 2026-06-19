export interface Rating {
  id: string;
  score: number;
  createdAt: string;
  updatedAt: string;
  userId: string;
  filmId: string;
}

export interface RatingWithUser extends Rating {
  user: {
    username: string;
    avatar: string | null;
  };
}
