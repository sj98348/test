export const DataverseTables = {
  userPrimaryFloc: "ngmm_ngmmsmartnotificationsuserprimaryfloc",
  primaryFloc: "ngmm_ngmmsmartnotificationsprimaryfloc"
};

export const UserPrimaryFlocFields = {
  id: "ngmm_ngmmsmartnotificationsuserprimaryflocid",
  email: "ngmm_emailaddress",
  entraObjectId: "ngmm_entraobjectid",
  flocCode: "ngmm_floccode"
};

export const PrimaryFlocFields = {
  id: "ngmm_ngmmsmartnotificationsprimaryflocid",
  name: "ngmm_newcolumn",
  longitude: "ngmm_longitude",
  latitude: "ngmm_latitude",
  geoSearchType: "ngmm_geosearchtype",
  flocName: "ngmm_flocname",
  flocCode: "ngmm_floccode",
  businessUnit: "ngmm_businessunit"
};

export const EquipmentTables = {
  customerAsset: "msdyn_customerasset"
};

export const EquipmentFields = {
  id: "msdyn_customerassetid",
  equipmentNumber: "ngmm_equipmentnumber",
  sortField: "ngmm_equipsortfield",
  sortName: "ngmm_sortname",
  description: "msdyn_name",
  functionalLocation: "_msdyn_functionallocation_value",
  plannerGroup: "_ngmm_plannergroupid_value",
  catalogProfileCode: "_ngmm_catalogprofilecodeid_value",
  objectTypeCode: "ngmm_objecttypecode"
};

export const CacheKeys = {
  primaryFlocLocations: "ngmm_primary_floc_locations_cache_v1",
  equipmentList: "ngmm_equipment_list_cache_v1"
};