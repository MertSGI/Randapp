import { dataProvider } from './dataProvider';
import { TenantBranding } from '../types';

const getBrandingKey = (tenantId: string) => `randapp:${tenantId}:branding`;

export const getBranding = async (tenantId: string): Promise<TenantBranding | null> => {
  return dataProvider.get<TenantBranding>(getBrandingKey(tenantId));
};

export const updateBranding = async (tenantId: string, branding: TenantBranding): Promise<void> => {
  await dataProvider.set(getBrandingKey(tenantId), branding);
};
