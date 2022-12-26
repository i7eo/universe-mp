/**
 * @description: Request result set
 */
export enum ResultEnum {
  SUCCESS = 0,
  ERROR = 1,
  TIMEOUT = 401,
  TYPE = "success",
}

/**
 * @description: request method
 */
export enum RequestEnum {
  GET = "get",
  POST = "post",
  PUT = "put",
  DELETE = "delete",
}

/**
 * @description: contentTyp
 */
export enum ContentTypeEnum {
  // json
  JSON = "application/json;charset=UTF-8",
  // form-data qs
  FORM_URLENCODED = "application/x-www-form-urlencoded;charset=UTF-8",
  // form-data  upload
  FORM_DATA = "multipart/form-data;charset=UTF-8",
}

/**
 * @description: timeout
 */
export enum TimeoutEnum {
  /** 普通超时 */
  TIMEOUT = 30 * 1000,
  /** 文件上传超时 */
  TIMEOUT_FILE_UPLOAD = 10 * 60 * 1000,
  /** 文件下载超时 */
  TIMEOUT_FILE_DOWNLOAD = 10 * 60 * 1000,
}
