import { IInputs } from "../../generated/ManifestTypes";
import { LocationOption } from "../../models/LocationModels";

const FLOC_LOCATION_TABLE = "ngmm_ngmmsmartnotificationsprimaryfloc";

const PRIMARY_KEY_FIELD = "ngmm_ngmmsmartnotificationsprimaryflocid";
const NAME_FIELD = "ngmm_newcolumn";
const LONGITUDE_FIELD = "ngmm_longitude";
const LATITUDE_FIELD = "ngmm_latitude";
const GEO_SEARCH_TYPE_FIELD = "ngmm_geosearchtype";
const FLOC_NAME_FIELD = "ngmm_flocname";
const FLOC_CODE_FIELD = "ngmm_floccode";
const BU_FIELD = "ngmm_businessunit";

export class FlocLocationService {
  public static async getAllLocations(
    context: ComponentFramework.Context<IInputs>
  ): Promise<LocationOption[]> {
    const query =
      `?$select=${PRIMARY_KEY_FIELD},${NAME_FIELD},${LONGITUDE_FIELD},${LATITUDE_FIELD},${GEO_SEARCH_TYPE_FIELD},${FLOC_NAME_FIELD},${FLOC_CODE_FIELD},${BU_FIELD}` +
      `&$orderby=${NAME_FIELD} asc`;

    const result = await context.webAPI.retrieveMultipleRecords(
      FLOC_LOCATION_TABLE,
      query
    );

    return result.entities.map((row) => ({
      id: String(row[PRIMARY_KEY_FIELD]),
      name: String(row[NAME_FIELD] || ""),
      bu: String(row[BU_FIELD] || ""),
      flocCode: String(row[FLOC_CODE_FIELD] || ""),
      flocName: String(row[FLOC_NAME_FIELD] || ""),
      geoSearchType: String(row[GEO_SEARCH_TYPE_FIELD] || ""),
      latitude: row[LATITUDE_FIELD] ? Number(row[LATITUDE_FIELD]) : undefined,
      longitude: row[LONGITUDE_FIELD] ? Number(row[LONGITUDE_FIELD]) : undefined
    }));
  }

  public static getDistinctBUs(locations: LocationOption[]): string[] {
    return Array.from(
      new Set(
        locations
          .map((location) => location.bu)
          .filter((bu) => bu)
      )
    ).sort();
  }

  public static filterByBU(
    locations: LocationOption[],
    bu: string
  ): LocationOption[] {
    return locations.filter((location) => location.bu === bu);
  }
  public static filterNearMe(
  locations: LocationOption[],
  latitude: number,
  longitude: number,
  radiusMiles: number
): LocationOption[] {
  return locations.filter((location) => {
    if (!location.latitude || !location.longitude) {
      return false;
    }

    const distance = this.calculateDistanceMiles(
      latitude,
      longitude,
      location.latitude,
      location.longitude
    );

    return distance <= radiusMiles;
  });
}

private static calculateDistanceMiles(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const earthRadiusMiles = 3958.8;

  const dLat = this.toRadians(lat2 - lat1);
  const dLon = this.toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(this.toRadians(lat1)) *
      Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusMiles * c;
}

private static toRadians(value: number): number {
  return value * (Math.PI / 180);
}
}