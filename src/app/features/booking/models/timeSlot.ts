export interface TimeSlotRequestDTO {
  startTime:string,
  endTime:string
}

export interface TimeSlotResponseDTO extends TimeSlotRequestDTO {
  id:string,
  stationId:string,
  stationName:string
}
