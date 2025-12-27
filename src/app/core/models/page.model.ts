export interface Page<T> {
  content: T[];          // La liste des éléments (ex: Stations)
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;       
  empty: boolean;
}
