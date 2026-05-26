import { ReferralCampaign, ReferralCode, ReferralLead } from '../types';

// Mock storage keys
const CAMPAIGNS_KEY = 'randapp_referral_campaigns';
const CODES_KEY = 'randapp_referral_codes';
const LEADS_KEY = 'randapp_referral_leads';

const defaultPlatformCampaigns: ReferralCampaign[] = [
  {
    id: 'campaign_b2p_1',
    tenantId: 'SUPER_ADMIN',
    name: 'Platform Growth: Refer a Business',
    type: 'business_to_platform',
    status: 'active',
    rewardType: 'free_days',
    rewardValue: 30, // Referrer gets 30 free days
    startDate: new Date().toISOString(),
  }
];

export const referralService = {
  // Campaigns
  getCampaigns: (tenantId: string): ReferralCampaign[] => {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    const campaigns: ReferralCampaign[] = raw ? JSON.parse(raw) : defaultPlatformCampaigns;
    return campaigns.filter(c => c.tenantId === tenantId);
  },

  getAllCampaignsForSuperAdmin: (): ReferralCampaign[] => {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    return raw ? JSON.parse(raw) : defaultPlatformCampaigns;
  },

  saveCampaign: (campaign: ReferralCampaign) => {
    const raw = localStorage.getItem(CAMPAIGNS_KEY);
    const campaigns: ReferralCampaign[] = raw ? JSON.parse(raw) : defaultPlatformCampaigns;
    
    const existingIndex = campaigns.findIndex(c => c.id === campaign.id);
    if (existingIndex > -1) {
      campaigns[existingIndex] = campaign;
    } else {
      campaigns.push(campaign);
    }
    
    localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  },

  // Codes
  getCodesForCampaign: (campaignId: string): ReferralCode[] => {
    const raw = localStorage.getItem(CODES_KEY);
    const codes: ReferralCode[] = raw ? JSON.parse(raw) : [];
    return codes.filter(c => c.campaignId === campaignId);
  },

  getCodesByReferrer: (referrerId: string): ReferralCode[] => {
    const raw = localStorage.getItem(CODES_KEY);
    const codes: ReferralCode[] = raw ? JSON.parse(raw) : [];
    return codes.filter(c => c.referrerId === referrerId);
  },

  generateCode: (campaignId: string, referrerId: string, limit: number = 0): ReferralCode => {
    const raw = localStorage.getItem(CODES_KEY);
    const codes: ReferralCode[] = raw ? JSON.parse(raw) : [];
    
    const newCode: ReferralCode = {
      id: `code_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      campaignId,
      referrerId,
      code: `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      usageLimit: limit,
      usageCount: 0
    };
    
    codes.push(newCode);
    localStorage.setItem(CODES_KEY, JSON.stringify(codes));
    return newCode;
  },

  // Leads
  getLeadsForCode: (codeId: string): ReferralLead[] => {
    const raw = localStorage.getItem(LEADS_KEY);
    const leads: ReferralLead[] = raw ? JSON.parse(raw) : [];
    return leads.filter(l => l.codeId === codeId);
  },

  getLeadsForCampaign: (campaignId: string): ReferralLead[] => {
     // A bit inefficient for mock, but works
     const codes = referralService.getCodesForCampaign(campaignId);
     const codeIds = codes.map(c => c.id);
     
     const raw = localStorage.getItem(LEADS_KEY);
     const allLeads: ReferralLead[] = raw ? JSON.parse(raw) : [];
     
     return allLeads.filter(l => codeIds.includes(l.codeId));
  },

  trackLead: (code: string, refereeEmail: string): ReferralLead | null => {
     const rawCodes = localStorage.getItem(CODES_KEY);
     const codes: ReferralCode[] = rawCodes ? JSON.parse(rawCodes) : [];
     
     const foundCode = codes.find(c => c.code === code);
     if (!foundCode) return null;
     
     if (foundCode.usageLimit > 0 && foundCode.usageCount >= foundCode.usageLimit) {
        return null; // Limit reached
     }

     const rawLeads = localStorage.getItem(LEADS_KEY);
     const leads: ReferralLead[] = rawLeads ? JSON.parse(rawLeads) : [];
     
     const newLead: ReferralLead = {
         id: `lead_${Date.now()}`,
         codeId: foundCode.id,
         refereeEmail,
         status: 'pending'
     };
     
     leads.push(newLead);
     localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
     return newLead;
  },

  convertLead: (leadId: string) => {
     const rawLeads = localStorage.getItem(LEADS_KEY);
     const leads: ReferralLead[] = rawLeads ? JSON.parse(rawLeads) : [];
     
     const existingIndex = leads.findIndex(l => l.id === leadId);
     if (existingIndex > -1 && leads[existingIndex].status === 'pending') {
         leads[existingIndex].status = 'converted';
         leads[existingIndex].convertedAt = new Date().toISOString();
         localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
         
         // Update usage count
         const rawCodes = localStorage.getItem(CODES_KEY);
         const codes: ReferralCode[] = rawCodes ? JSON.parse(rawCodes) : [];
         const codeIndex = codes.findIndex(c => c.id === leads[existingIndex].codeId);
         if (codeIndex > -1) {
             codes[codeIndex].usageCount++;
             localStorage.setItem(CODES_KEY, JSON.stringify(codes));
         }
     }
  }
};
