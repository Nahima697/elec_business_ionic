export interface BookingRequestDTO {
  stationId:string,
  startDate:string,
  endDate:string
}

export interface BookingResponseDTO extends BookingRequestDTO {
  id:string,
  totalPrice:number,
  statusLabel: string,
  stationName: string,
  userName:string,
  stationOwnerName:string

}
