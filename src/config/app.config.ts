interface AppConfigInterface {
  ownerRoles: string[];
  customerRoles: string[];
  tenantRoles: string[];
  tenantName: string;
  applicationName: string;
  addOns: string[];
}
export const appConfig: AppConfigInterface = {
  ownerRoles: ['Team Member'],
  customerRoles: [],
  tenantRoles: ['Team Member'],
  tenantName: 'Organization',
  applicationName: 'Dexirity',
  addOns: ['file', 'notifications', 'chat'],
};
