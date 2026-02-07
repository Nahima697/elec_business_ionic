export interface CreateReviewDTO {
  reviewTitle: string,
  reviewContent: string;
  reviewRating: number;
  stationId: string;
}

export interface reviewResponseDTO {
  id: string;
  reviewTitle: string,
  reviewContent: string;
  reviewRating: number;
  stationId: string;
  userId: string;
  username: string;
  createdAt: string;
}
