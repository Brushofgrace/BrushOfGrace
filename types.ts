export interface Artwork {
  id: string;
  title: string;
  imageUrl: string;
  artist?: string;
  description?: string;
  uploadDate: string; // ISO string for date
}
