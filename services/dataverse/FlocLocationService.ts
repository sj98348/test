import { IInputs } from "../../generated/ManifestTypes";
import { LocationOption } from "../../models/LocationModels";
import {
  CacheKeys,
  DataverseTables,
  PrimaryFlocFields
} from "../config/DataverseConfig";
import { LocalCacheService } from "../cache/LocalCacheService";
import { DataverseRepository } from "./DataverseRepository";

export class FlocLocationService {
  public static async getAllLocations(
    context: ComponentFramework.Context<IInputs>,
    forceRefresh = false
  ): Promise<LocationOption[]> {
    if (!forceRefresh) {
      const cachedLocations = LocalCacheService.get<LocationOption[]>(
        CacheKeys.primaryFlocLocations
      );

      if (cachedLocations && cachedLocations.length > 0) {
        console.log("Using cached FLOC locations", cachedLocations.length);
        return cachedLocations;
      }
    }

    try {
      const query =
        `?$select=${PrimaryFlocFields.id},${PrimaryFlocFields.name},` +
        `${PrimaryFlocFields.longitude},${PrimaryFlocFields.latitude},` +
        `${PrimaryFlocFields.geoSearchType},${PrimaryFlocFields.flocName},` +
        `${PrimaryFlocFields.flocCode},${PrimaryFlocFields.businessUnit}` +
        `&$orderby=${PrimaryFlocFields.name} asc`;

      const result = await DataverseRepository.retrieveMultiple(
        context,
        DataverseTables.primaryFloc,
        query
      );

      console.log("Raw FLOC records", result.entities);

      const mappedLocations = result.entities.map((row) => ({
        id: String(row[PrimaryFlocFields.id] || ""),
        name: String(row[PrimaryFlocFields.name] || ""),
        bu: String(
          row[
            `${PrimaryFlocFields.businessUnit}@OData.Community.Display.V1.FormattedValue`
          ] || row[PrimaryFlocFields.businessUnit] || ""
        ),
        flocCode: String(row[PrimaryFlocFields.flocCode] || ""),
        flocName: String(row[PrimaryFlocFields.flocName] || ""),
        geoSearchType: String(row[PrimaryFlocFields.geoSearchType] || ""),
        latitude: row[PrimaryFlocFields.latitude]
          ? Number(row[PrimaryFlocFields.latitude])
          : undefined,
        longitude: row[PrimaryFlocFields.longitude]
          ? Number(row[PrimaryFlocFields.longitude])
          : undefined
      }));

      LocalCacheService.set(CacheKeys.primaryFlocLocations, mappedLocations);

      return mappedLocations;
    } catch (error) {
      const cachedLocations = LocalCacheService.get<LocationOption[]>(
        CacheKeys.primaryFlocLocations
      );

      if (cachedLocations && cachedLocations.length > 0) {
        console.log("Dataverse load failed. Using cached FLOC locations", error);
        return cachedLocations;
      }

      throw error;
    }
  }

  public static clearLocationCache(): void {
    LocalCacheService.remove(CacheKeys.primaryFlocLocations);
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
    const selectedBu = this.normalizeText(bu);

    return locations.filter(
      (location) => this.normalizeText(location.bu) === selectedBu
    );
  }

  public static filterByText(
    locations: LocationOption[],
    text: string
  ): LocationOption[] {
    const search = this.normalizeText(text);

    if (!search) {
      return locations;
    }

    return locations.filter(
      (location) =>
        this.normalizeText(location.name).includes(search) ||
        this.normalizeText(location.flocName || "").includes(search) ||
        this.normalizeText(location.flocCode).includes(search)
    );
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

  private static normalizeText(value: string): string {
    return value.trim().toLowerCase();
  }
}
