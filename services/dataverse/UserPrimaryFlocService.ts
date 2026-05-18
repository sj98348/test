import { IInputs } from "../../generated/ManifestTypes";
import {
  DataverseTables,
  UserPrimaryFlocFields
} from "../config/DataverseConfig";
import { DataverseRepository } from "./DataverseRepository";

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

export interface LoggedInUser {
  email: string;
  entraObjectId: string;
  fullName: string;
}

export class UserPrimaryFlocService {
  public static async getLoggedInUser(
    context: ComponentFramework.Context<IInputs>
  ): Promise<LoggedInUser> {
    const userId = context.userSettings.userId
      .replace("{", "")
      .replace("}", "");

    const user = await DataverseRepository.retrieve(
      context,
      "systemuser",
      userId,
      "?$select=internalemailaddress,azureactivedirectoryobjectid,fullname"
    );

    return {
      email: String(user.internalemailaddress || ""),
      entraObjectId: String(user.azureactivedirectoryobjectid || ""),
      fullName: String(user.fullname || "")
    };
  }

  public static getCurrentPosition(): Promise<GeoPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          reject(new Error(error.message));
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      );
    });
  }

  public static async getUserPrimaryFlocCode(
    context: ComponentFramework.Context<IInputs>
  ): Promise<string> {
    const user = await this.getLoggedInUser(context);

    const query =
      `?$select=${UserPrimaryFlocFields.flocCode}` +
      `&$filter=${UserPrimaryFlocFields.email} eq '${this.escapeODataText(
        user.email
      )}'`;

    const result = await DataverseRepository.retrieveMultiple(
      context,
      DataverseTables.userPrimaryFloc,
      query
    );

    if (result.entities.length === 0) {
      return "";
    }

    return String(result.entities[0][UserPrimaryFlocFields.flocCode] || "");
  }

  public static async updateUserPrimaryFlocCode(
    context: ComponentFramework.Context<IInputs>,
    email: string,
    entraObjectId: string,
    flocCode: string
  ): Promise<void> {
    const query =
      `?$select=${UserPrimaryFlocFields.id},${UserPrimaryFlocFields.email}` +
      `&$filter=${UserPrimaryFlocFields.email} eq '${this.escapeODataText(
        email
      )}'`;

    const existing = await DataverseRepository.retrieveMultiple(
      context,
      DataverseTables.userPrimaryFloc,
      query
    );

    const payload = {
      [UserPrimaryFlocFields.email]: email,
      [UserPrimaryFlocFields.entraObjectId]: entraObjectId,
      [UserPrimaryFlocFields.flocCode]: flocCode
    };

    if (existing.entities.length > 0) {
      const recordId = String(existing.entities[0][UserPrimaryFlocFields.id]);

      await DataverseRepository.update(
        context,
        DataverseTables.userPrimaryFloc,
        recordId,
        payload
      );
    } else {
      await DataverseRepository.create(
        context,
        DataverseTables.userPrimaryFloc,
        payload
      );
    }
  }

  public static async saveCurrentLocation(
    context: ComponentFramework.Context<IInputs>
  ): Promise<void> {
    const user = await this.getLoggedInUser(context);
    const position = await this.getCurrentPosition();

    console.log("Latitude:", position.latitude);
    console.log("Longitude:", position.longitude);

    await this.updateUserPrimaryFlocCode(
      context,
      user.email,
      user.entraObjectId,
      "20"
    );
  }

  private static escapeODataText(value: string): string {
    return value.replace(/'/g, "''");
  }
}
