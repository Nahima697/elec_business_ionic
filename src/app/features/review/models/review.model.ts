export interface CreateReviewDTO {
  reviewtitle: string,
  reviewContent: string;
  reviewRating: number;
  stationId: string;
}

export interface reviewResponseDTO {
  id: string;
  reviewtitle: string,
  reviewContent: string;
  reviewRating: number;
  stationId: string;
  userId: string;
  username: string;
  createdAt: string;
}
