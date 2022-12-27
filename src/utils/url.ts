/**
 * 根据指定url或者window.location.href获取url中的参数
 *
 * @param name
 * @param url
 * @returns
 */
export function getQueryParam(name: string, url?: string): string {
  const _url = url || window.location.href;

  return window.decodeURIComponent(
    // eslint-disable-next-line prefer-template, no-sparse-arrays
    (new RegExp("[?|&]" + name + "=" + "([^&;]+?)(&|#|;|$)").exec(_url) || [, ""])[1].replace(
      /\+/g,
      "%20"
    )
  );
}

/**
 * 删除指定的url参数并且返回新的url
 *
 * @param name
 * @param url
 * @returns
 */
export function removeQueryParam(name: string | string[], url?: string): string {
  if (!name || (name && !name.length)) return "";

  let names: string[] = [];
  if (typeof name === "string") {
    names = [name];
  } else {
    names = name;
  }

  let _url = url || window.location.href;

  for (let i = 0; i < names.length; i++) {
    const _name = names[i];
    // eslint-disable-next-line prefer-template
    _url = _url.replace(new RegExp("[?|&]" + _name + "=" + getQueryParam(_name, _url), "g"), "");
  }

  return _url;
}

export function resetHashUrl() {
  return (
    window.location.origin +
    window.location.pathname +
    (window.location.hash || "#/") +
    window.location.search
  );
}

export function updateHashUrl() {
  return (
    window.location.origin +
    window.location.pathname +
    window.location.hash +
    window.location.search
  );
}
