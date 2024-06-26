export enum COMPANY_ORDER_BY {
  COMPANY_ID = 'id',
  //  COMPANY_NAME = 'company_name',
  COMPANY_NAME = 'company_nm',
  COMPANY_DIV = 'company_div',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export const REGEX_PHONE_JP =
  /^(?=(?:\d{1,4}-){2}\d{1,5}$)[\d-]{1,13}$/;

export const REGEX_KATAGANA = /^([ァ-ン]|ー|\s)+$/;
