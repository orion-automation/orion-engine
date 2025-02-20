import Cookies from "js-cookie";

const TokenKey = "token";
const BasicTokenKey = "basicToken";
const ExtraTokenKey = "token-extra";
const TenantKey = "hr-tenant";
const TenantNameKey = "hr-tenantName";
const I18nLocaleKey = "i18n-locale";
const DefaultGroupKey = "default-group";
const DelegateKey = "delegateId";

export function getDelegateId() {
  return Cookies.get(DelegateKey);
}

export function setDelegateId(id) {
  return Cookies.set(DelegateKey, id);
}

export function removeDelegateId() {
  return Cookies.remove(DelegateKey);
}

export function getDefaultGroup() {
  return Cookies.get(DefaultGroupKey);
}

export function setDefaultGroup(group) {
  return Cookies.set(DefaultGroupKey, group);
}

export function getI18nLocale() {
  return Cookies.get(I18nLocaleKey);
}

export function setI18nLocale(locale) {
  return Cookies.set(I18nLocaleKey,locale);
}

export function getExtraToken () {
  return Cookies.get(ExtraTokenKey);
}

export function setExtraToken (token) {
  return Cookies.set(ExtraTokenKey, token);
}

export function removeExtraToken () {
  return Cookies.remove(ExtraTokenKey);
}

export function getToken () {
  return Cookies.get(TokenKey);
}

export function setToken (token) {
  return Cookies.set(TokenKey, token);
}

export function removeToken () {
  return Cookies.remove(TokenKey);
}

export function getBasicToken () {
  return Cookies.get(BasicTokenKey);
}

export function setBasicToken (basicToken) {
  return Cookies.set(BasicTokenKey, basicToken);
}

export function removeBasicToken () {
  return Cookies.remove(BasicTokenKey);
}

export function getTenant() {
  return Cookies.get(TenantKey);
}

export function setTenant(tenant) {
  return Cookies.set(TenantKey, tenant);
}

export function removeTenant() {
  return Cookies.remove(TenantKey);
}

export function getTenantName() {
  return Cookies.get(TenantNameKey);
}

export function setTenantName(tenantName) {
  return Cookies.set(TenantNameKey, tenantName);
}

export function removeTenantName() {
  return Cookies.remove(TenantNameKey);
}
