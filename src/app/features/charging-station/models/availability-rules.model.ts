export interface AvailabilityRuleDTO {
  id?: string;          
  stationId?: string;
  chargingStation?: {
    id: string;
  };
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}
