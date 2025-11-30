import { ChargingLocation } from "./chargingLocation.model";

 export interface ChargingStation {
  id:string,
  name:string,
  description:string,
  powerKw:number,
  price:number,
  createdAt:Date,
  lng: number,
  lat: number,
  imageUrl?: string,
  locationDTO:ChargingLocation
 }
