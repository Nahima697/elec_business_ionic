import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { reviewResponseDTO } from '../models/review.model';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {

 private http = inject(HttpClient);
  private apiUrl = '/reviews';
  submitReview(CreateReviewDTO: { reviewTitle: string; reviewContent: string; reviewRating: number; stationId: string; }) :Observable<reviewResponseDTO> {
    const body = { reviewTitle: CreateReviewDTO.reviewTitle, reviewContent: CreateReviewDTO.reviewContent, reviewRating: CreateReviewDTO.reviewRating, stationId: CreateReviewDTO.stationId };
    return this.http.post<reviewResponseDTO>(`${this.apiUrl}`, body);
  }

  getReviewsByStation(stationId: string): Observable<reviewResponseDTO[]> {
    return this.http.get<reviewResponseDTO[]>(`${this.apiUrl}/station/${stationId}`);
  }
}
