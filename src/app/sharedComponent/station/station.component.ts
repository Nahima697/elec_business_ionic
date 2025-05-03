import { LngLatLike } from "maplibre-gl"


   export const STATION:Station[] =
  [
    {
      "id": 1,
      "nom": "Station 1",
      "latitude": 45.7640,
      "longitude": 4.8357,
      "puissance": "22kW",
      "adresse": "Lyon, 69001, France"
    },
    {
      "id": 2,
      "nom": "Station 2",
      "latitude": 45.7655,
      "longitude": 4.8444,
      "puissance": "50kW",
      "adresse": "Lyon, 69002, France"
    },
    {
      "id": 3,
      "nom": "Station 3",
      "latitude": 45.7633,
      "longitude": 4.8314,
      "puissance": "11kW",
      "adresse": "Lyon, 69003, France"
    },
    {
      "id": 4,
      "nom": "Station 4",
      "latitude": 45.7610,
      "longitude": 4.8321,
      "puissance": "22kW",
      "adresse": "Lyon, 69004, France"
    },
    {
      "id": 5,
      "nom": "Station 5",
      "latitude": 45.7625,
      "longitude": 4.8523,
      "puissance": "50kW",
      "adresse": "Lyon, 69005, France"
    },
    {
      "id": 6,
      "nom": "Station 6",
      "latitude": 45.7597,
      "longitude": 4.8535,
      "puissance": "22kW",
      "adresse": "Lyon, 69006, France"
    },
    {
      "id": 7,
      "nom": "Station 7",
      "latitude": 45.7601,
      "longitude": 4.8499,
      "puissance": "50kW",
      "adresse": "Lyon, 69007, France"
    },
    {
      "id": 8,
      "nom": "Station 8",
      "latitude": 45.7548,
      "longitude": 4.8581,
      "puissance": "11kW",
      "adresse": "Lyon, 69008, France"
    },
    {
      "id": 9,
      "nom": "Station 9",
      "latitude": 45.7532,
      "longitude": 4.8596,
      "puissance": "22kW",
      "adresse": "Lyon, 69009, France"
    },
    {
      "id": 10,
      "nom": "Station 10",
      "latitude": 45.7554,
      "longitude": 4.8624,
      "puissance": "50kW",
      "adresse": "Lyon, 69010, France"
    },
    {
      "id": 11,
      "nom": "Station 11",
      "latitude": 45.7730,
      "longitude": 4.8712,
      "puissance": "22kW",
      "adresse": "Villeurbanne, 69100, France"
    },
    {
      "id": 12,
      "nom": "Station 12",
      "latitude": 45.7743,
      "longitude": 4.8745,
      "puissance": "50kW",
      "adresse": "Villeurbanne, 69100, France"
    },
    {
      "id": 13,
      "nom": "Station 13",
      "latitude": 45.7760,
      "longitude": 4.8777,
      "puissance": "22kW",
      "adresse": "Villeurbanne, 69100, France"
    },
    {
      "id": 14,
      "nom": "Station 14",
      "latitude": 45.7775,
      "longitude": 4.8799,
      "puissance": "11kW",
      "adresse": "Villeurbanne, 69100, France"
    },
    {
      "id": 15,
      "nom": "Station 15",
      "latitude": 45.7788,
      "longitude": 4.8832,
      "puissance": "50kW",
      "adresse": "Villeurbanne, 69100, France"
    }
  ]




export interface Station {
  id:number,
  nom:string,
  latitude:number,
  longitude:number,
  puissance:string,
  adresse:string,
}
