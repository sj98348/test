export interface SelectedLocation {
  id: string;
  name: string;
  bu: string;
  flocCode: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationOption {
  id: string;
  name: string;
  bu: string;
  flocCode: string;
  flocName?: string;
  geoSearchType?: string;
  latitude?: number;
  longitude?: number;
}