export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}

/**
 * 权限模式
 */
export enum PermissionModeEnum {
  // role
  ROLE = "ROLE",
  // black
  BACK = "BACK",
  // route mapping
  ROUTE_MAPPING = "ROUTE_MAPPING",
}

//  Route switching animation
export enum RouterTransitionEnum {
  ZOOM_FADE = "zoom-fade",
  ZOOM_OUT = "zoom-out",
  FADE_SIDE = "fade-slide",
  FADE = "fade",
  FADE_BOTTOM = "fade-bottom",
  FADE_SCALE = "fade-scale",
}

export const SYS_PERMISSION_PREFIX = "portal_sys_";
