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
  }> {
    console.log("STEP 1 - getLoggedInUser started");

    const rawUserId = context.userSettings.userId;

    console.log("STEP 2 - Raw User Id", rawUserId);

    const userId = rawUserId.replace("{", "").replace("}", "");

    console.log("STEP 3 - Clean User Id", userId);

    const user = await context.webAPI.retrieveRecord(
      "systemuser",
      userId,
      "?$select=internalemailaddress,azureactivedirectoryobjectid"
    );

    console.log("STEP 4 - User retrieved", user);

    return {
      email: String(user.internalemailaddress || ""),
      entraObjectId: String(user.azureactivedirectoryobjectid || "")
    };
  }

  public static getCurrentPosition(): Promise<GeoPosition> {
    console.log("STEP 5 - getCurrentPosition started");

    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported."));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("STEP 6 - GPS success", position);

          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.log("STEP 7 - GPS error", error);
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

  public static async updateUserPrimaryFlocCode(
    context: ComponentFramework.Context<IInputs>,
    email: string,
    entraObjectId: string,
    flocCode: string
  ): Promise<void> {
    console.log("STEP 8 - updateUserPrimaryFlocCode started");

    const query =
      `?$select=${PRIMARY_KEY_FIELD},${EMAIL_FIELD}` +
      `&$filter=${EMAIL_FIELD} eq '${email.replace("'", "''")}'`;

    console.log("STEP 9 - Query", query);

    const existing = await context.webAPI.retrieveMultipleRecords(
      TABLE_NAME,
      query
    );

    console.log("STEP 10 - Existing records", existing);

    const payload = {
      [EMAIL_FIELD]: email,
      [ENTRA_OBJECT_ID_FIELD]: entraObjectId,
      [FLOC_CODE_FIELD]: flocCode
    };

    console.log("STEP 11 - Payload", payload);

    if (existing.entities.length > 0) {
      const recordId = existing.entities[0][PRIMARY_KEY_FIELD];

      console.log("STEP 12 - Updating record id", recordId);

      await context.webAPI.updateRecord(TABLE_NAME, recordId, payload);

      console.log("STEP 13 - Record updated");
    } else {
      console.log("STEP 12B - Creating new record");

      const createResult = await context.webAPI.createRecord(
        TABLE_NAME,
        payload
      );

      console.log("STEP 13B - Record created", createResult);
    }
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
  public static async createOrUpdateTestLocation(
    context: ComponentFramework.Context<IInputs>
  ): Promise<void> {
    try {
      console.log("STEP 14 - createOrUpdateTestLocation started");

      const user = await this.getLoggedInUser(context);

      console.log("STEP 15 - User object", user);

      const position = await this.getCurrentPosition();

      console.log("STEP 16 - Latitude", position.latitude);
      console.log("STEP 17 - Longitude", position.longitude);

      await this.updateUserPrimaryFlocCode(
        context,
        user.email,
        user.entraObjectId,
        "20"
      );

      console.log("STEP 18 - createOrUpdateTestLocation completed");
    } catch (error) {
      console.log("STEP ERROR - Exception occurred", error);
      throw error;
    }
  }
}