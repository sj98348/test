import { IInputs } from "../../generated/ManifestTypes";
import { EquipmentItem } from "../../models/EquipmentModels";
import {
  CacheKeys,
  EquipmentFields,
  EquipmentTables
} from "../config/DataverseConfig";
import { LocalCacheService } from "../cache/LocalCacheService";
import { DataverseRepository } from "./DataverseRepository";

export class EquipmentService {
  public static async getAllEquipment(
    context: ComponentFramework.Context<IInputs>,
    forceRefresh = false
  ): Promise<EquipmentItem[]> {
    if (!forceRefresh) {
      const cached = LocalCacheService.get<EquipmentItem[]>(
        CacheKeys.equipmentList
      );

      if (cached && cached.length > 0) {
        return cached;
      }
    }

    const query =
      `?$select=${EquipmentFields.id},` +
      `${EquipmentFields.equipmentNumber},${EquipmentFields.description},` +
      `${EquipmentFields.sortField},${EquipmentFields.sortName},` +
      `${EquipmentFields.functionalLocation},${EquipmentFields.plannerGroup},` +
      `${EquipmentFields.catalogProfileCode},${EquipmentFields.objectTypeCode}` +
      `&$orderby=${EquipmentFields.description} asc` +
      `&$top=2000`;

    const result = await DataverseRepository.retrieveMultiple(
      context,
      EquipmentTables.customerAsset,
      query
    );

    const mapped: EquipmentItem[] = result.entities.map((row) => ({
      id: String(row[EquipmentFields.id] || ""),
      equipmentNumber: String(row[EquipmentFields.equipmentNumber] || ""),
      description: String(row[EquipmentFields.description] || ""),
      sortField: String(row[EquipmentFields.sortField] || ""),
      sortName: String(row[EquipmentFields.sortName] || ""),
      functionalLocationId: String(row[EquipmentFields.functionalLocation] || ""),
      functionalLocationName: String(
        row[
          `${EquipmentFields.functionalLocation}@OData.Community.Display.V1.FormattedValue`
        ] || ""
      ),
      plannerGroupId: String(row[EquipmentFields.plannerGroup] || ""),
      plannerGroupName: String(
        row[
          `${EquipmentFields.plannerGroup}@OData.Community.Display.V1.FormattedValue`
        ] || ""
      ),
      catalogProfileCode: String(
        row[
          `${EquipmentFields.catalogProfileCode}@OData.Community.Display.V1.FormattedValue`
        ] ||
          row[EquipmentFields.catalogProfileCode] ||
          ""
      ),
      objectTypeCode: String(row[EquipmentFields.objectTypeCode] || "")
    }));

    LocalCacheService.set(CacheKeys.equipmentList, mapped);

    return mapped;
  }

  public static searchEquipment(
    equipmentList: EquipmentItem[],
    searchText: string,
    primaryFlocCode: string,
    plannerGroupId?: string
  ): EquipmentItem[] {
    const search = this.normalize(searchText);

    if (search.length < 3) {
      return [];
    }

    const searchWithZero = search.startsWith("0") ? search : `0${search}`;
    const flocCode = this.normalize(primaryFlocCode);

    return equipmentList
      .filter((equipment) => {
        const matchesSearch =
          this.normalize(equipment.sortField).startsWith(search) ||
          this.normalize(equipment.sortField).startsWith(searchWithZero) ||
          this.normalize(equipment.sortName).startsWith(search) ||
          this.normalize(equipment.sortName).startsWith(searchWithZero) ||
          this.normalize(equipment.equipmentNumber).startsWith(search) ||
          this.normalize(equipment.description).startsWith(search) ||
          this.normalize(equipment.functionalLocationName).startsWith(search);

        const matchesFloc =
          !flocCode ||
          this.normalize(equipment.functionalLocationName).startsWith(flocCode);

        const matchesPlannerGroup =
          !plannerGroupId ||
          equipment.plannerGroupId === plannerGroupId ||
          equipment.plannerGroupName === plannerGroupId;

        return matchesSearch && matchesFloc && matchesPlannerGroup;
      })
      .sort((a, b) => a.description.localeCompare(b.description));
  }

  public static clearEquipmentCache(): void {
    LocalCacheService.remove(CacheKeys.equipmentList);
  }

  private static normalize(value: string): string {
    return value.trim().toLowerCase();
  }
}