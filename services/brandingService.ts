import { apiClient } from './apiClient';
import { TenantBranding } from '../types';

const getBrandingKey = (tenantId: string) => `randapp:${tenantId}:branding`;

export const getBranding = async (tenantId: string): Promise<TenantBranding | null> => {
  return apiClient.get<TenantBranding>(getBrandingKey(tenantId));
};

export const updateBranding = async (tenantId: string, branding: TenantBranding): Promise<void> => {
  await apiClient.set(getBrandingKey(tenantId), branding);
};
