import e from "express";
import { reviewResponseDTO } from "../../review/models/review.model";
import { ChargingLocation } from "./charging-location.model";

 export interface ChargingStationRequestDTO {
  id:string,
  name:string,
  description:string,
  powerKw:number,
  price:number,
  lng: number,
  lat: number,
  imageUrl?: string,
  locationId:string,
 }

 export interface ChargingStationResponseDTO extends ChargingStationRequestDTO {
  id: string;
  reviewsDTO?: reviewResponseDTO[];
  createdAt?: string;
  locationDTO?: ChargingLocation;

 }

