
export interface AvailabilityRuleDTO {
  id: string;
  stationId: string;
  startTime: string;
  endTime: string;
  daysOfWeek: number[];
}
