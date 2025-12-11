import e from "express";
import { reviewResponseDTO } from "../../review/models/review.model";
import { ChargingLocation } from "./chargingLocation.model";

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

 }
export interface PostPictureDTO {
  title:string,
  description:string,
  image:string,
}

export interface UpdatePictureDTO extends PostPictureDTO {
  id:string
}
