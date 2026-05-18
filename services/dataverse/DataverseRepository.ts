import { IInputs } from "../../generated/ManifestTypes";

export class DataverseRepository {
  public static retrieveMultiple(
    context: ComponentFramework.Context<IInputs>,
    tableName: string,
    query: string
  ): Promise<ComponentFramework.WebApi.RetrieveMultipleResponse> {
    return context.webAPI.retrieveMultipleRecords(tableName, query);
  }

  public static retrieve(
    context: ComponentFramework.Context<IInputs>,
    tableName: string,
    id: string,
    query: string
  ): Promise<ComponentFramework.WebApi.Entity> {
    return context.webAPI.retrieveRecord(tableName, id, query);
  }

  public static create(
    context: ComponentFramework.Context<IInputs>,
    tableName: string,
    payload: ComponentFramework.WebApi.Entity
  ): Promise<ComponentFramework.LookupValue> {
    return context.webAPI.createRecord(tableName, payload);
  }

  public static update(
    context: ComponentFramework.Context<IInputs>,
    tableName: string,
    id: string,
    payload: ComponentFramework.WebApi.Entity
  ): Promise<ComponentFramework.LookupValue> {
    return context.webAPI.updateRecord(tableName, id, payload);
  }
}
