import { IInputs } from "../../generated/ManifestTypes";

const TABLE_NAME = "ngmm_ngmmsmartnotificationsuserprimaryfloc";
const PRIMARY_KEY_FIELD = "ngmm_ngmmsmartnotificationsuserprimaryflocid";

const EMAIL_FIELD = "ngmm_emailaddress";
const ENTRA_OBJECT_ID_FIELD = "ngmm_entraobjectid";
const FLOC_CODE_FIELD = "ngmm_floccode";

export interface GeoPosition {
  latitude: number;
  longitude: number;
}

export class UserPrimaryFlocService {
  
 public static async getLoggedInUser(
  context: ComponentFramework.Context<IInputs>
): Promise<{
  email: string;
  entraObjectId: string;
  fullName: string;
}> {
  const userId = context.userSettings.userId
    .replace("{", "")
    .replace("}", "");

  const user = await context.webAPI.retrieveRecord(
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
      `?$select=${FLOC_CODE_FIELD}` +
      `&$filter=${EMAIL_FIELD} eq '${user.email.replace("'", "''")}'`;

    const result = await context.webAPI.retrieveMultipleRecords(
      TABLE_NAME,
      query
    );

    if (result.entities.length === 0) {
      return "";
    }

    return String(result.entities[0][FLOC_CODE_FIELD] || "");
  }

  public static async updateUserPrimaryFlocCode(
    context: ComponentFramework.Context<IInputs>,
    email: string,
    entraObjectId: string,
    flocCode: string
  ): Promise<void> {
    const query =
      `?$select=${PRIMARY_KEY_FIELD},${EMAIL_FIELD}` +
      `&$filter=${EMAIL_FIELD} eq '${email.replace("'", "''")}'`;

    const existing = await context.webAPI.retrieveMultipleRecords(
      TABLE_NAME,
      query
    );

    const payload = {
      [EMAIL_FIELD]: email,
      [ENTRA_OBJECT_ID_FIELD]: entraObjectId,
      [FLOC_CODE_FIELD]: flocCode
    };

    if (existing.entities.length > 0) {
      const recordId = existing.entities[0][PRIMARY_KEY_FIELD];

      await context.webAPI.updateRecord(TABLE_NAME, recordId, payload);
    } else {
      await context.webAPI.createRecord(TABLE_NAME, payload);
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
}