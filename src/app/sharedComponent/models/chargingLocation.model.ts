import { User } from "src/app/core/auth/models/user.model";

export interface ChargingLocation {
id:string,
name:string,
adressLine:string,
postalCode:string,
city:string,
country:string,
userId:string
}
