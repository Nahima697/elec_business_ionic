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
  private router = inject(Router);
  private apiUrl = '/reviews';
  submitReview(CreateReviewDTO: { reviewtitle: string; reviewContent: string; reviewRating: number; stationId: string; }) :Observable<reviewResponseDTO> {
    const body = { reviewtitle: CreateReviewDTO.reviewtitle, reviewContent: CreateReviewDTO.reviewContent, reviewRating: CreateReviewDTO.reviewRating, stationId: CreateReviewDTO.stationId };
    return this.http.post<reviewResponseDTO>(`${this.apiUrl}/submit`, body);
  }

  getReviewsByStation(stationId: string): Observable<reviewResponseDTO[]> {
    return this.http.get<reviewResponseDTO[]>(`${this.apiUrl}/station/${stationId}`);
  }
}
