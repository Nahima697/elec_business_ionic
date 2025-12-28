
import { Page } from "src/app/core/models/page.model";
import { ChargingLocation } from "./charging-location.model";
import { reviewResponseDTO } from "../../review/models/review.model";

export interface ChargingStationRequestDTO {
  id: string;
  name: string;
  description: string;
  powerKw: number;
  price: number;
  lng: number;
  lat: number;
  imageUrl?: string;
  locationId: string;
}

export interface ChargingStationResponseDTO {
  id: string;
  name: string;
  description: string;
  powerKw: number;
  price: number;
  lng: number;
  lat: number;
  imageUrl?: string;
  createdAt?: string;
  locationDTO?: ChargingLocation;
  reviewsDTO?: reviewResponseDTO[];


  urls?: {
    thumbnail: string;
    original: string;
  };
}


export type ChargingStationPage = Page<ChargingStationResponseDTO>;
