import { TenantSnapshot } from './dataExportService';

export interface MigrationDryRunResult {
  ready: boolean;
  warnings: string[];
  blockers: string[];
  recommendedFixes: string[];
}

export const migrationDryRunService = {
  
  validateSnapshotForMigration(snapshot: TenantSnapshot | null): MigrationDryRunResult {
    const result: MigrationDryRunResult = {
      ready: false,
      warnings: [],
      blockers: [],
      recommendedFixes: []
    };

    if (!snapshot) {
      result.blockers.push("No data snapshot provided.");
      return result;
    }

    // 1. Tenant configuration and basic fields
    const account = snapshot.tenantAccount;
    if (!account) {
      result.blockers.push("Tenant Account object is missing.");
    } else {
      if (!account.id) {
        result.blockers.push("Tenant Account has no unique ID.");
      }
      if (!account.slug) {
        result.blockers.push("Tenant Account has no matching URL slug.");
        result.recommendedFixes.push("Ensure reservation slug is defined before migration.");
      }
      if (!account.plan) {
         result.warnings.push("Tenant Account has no plan assigned. Defaulting to 'basic'.");
      }
      if (!account.subscriptionStatus) {
         result.warnings.push("Tenant Account has no explicit billing status state.");
      }
    }
    
    // 2. Business profile check
    if (!snapshot.businessProfile) {
      result.blockers.push("Business profile object is completely missing.");
    } else {
      const bp = snapshot.businessProfile;
      if (!bp.public_display_name && (!account || !account.name)) {
        result.blockers.push("Business profile lacks a display name.");
      }
      // Public site fields check
      if (bp.is_public_profile_enabled === undefined) {
         result.warnings.push("Business profile lacks public-site visibility status configuration.");
      }
    }

    // 3. Catalog validations (Services & Staff)
    const services = snapshot.catalog?.services || [];
    const staff = snapshot.catalog?.staff || [];
    
    if (services.length === 0) {
      result.blockers.push("Business has no services defined.");
    } else {
      services.forEach(s => {
        if (!s.id || !s.name || s.price === undefined) {
          result.blockers.push(`Service entry ${s.id || 'unknown'} has invalid properties (missing name or price).`);
        }
      });
    }
    
    if (staff.length === 0) {
      result.blockers.push("Business has no staff defined.");
    } else {
      staff.forEach(st => {
        if (!st.id || !st.name) {
          result.blockers.push(`Staff entry ${st.id || 'unknown'} has invalid properties (missing name).`);
        }
      });
    }

    // 4. Secure Session & Credentials Checks (Safety Net)
    const snapshotString = JSON.stringify(snapshot);
    if (snapshotString.includes('"password"') || snapshotString.includes('"hashedPassword"')) {
       result.blockers.push("Snapshot contains user credentials or password fields, which must never be migrated.");
    }
    if (snapshotString.includes('"cardNumber"') || snapshotString.includes('"cvv"') || snapshotString.includes('"card_cvc"')) {
       result.blockers.push("Snapshot contains prohibited raw payment card details.");
    }
    if (snapshotString.includes('"apiKey"') || snapshotString.includes('"api_key"') || snapshotString.includes('"smtp_password"')) {
       result.blockers.push("Snapshot contains prohibited integration secrets or API credentials.");
    }

    // 5. Relational integrity (Appointments & Branches & Customers)
    const appointments = snapshot.appointments || [];
    const tenantIdStr = snapshot.tenantId;

    appointments.forEach(apt => {
        if (!apt.tenantId) {
            result.warnings.push(`Appointment ${apt.id} lacks a valid tenant_id binding.`);
        } else if (apt.tenantId !== tenantIdStr) {
            result.blockers.push(`Appointment ${apt.id} is associated with an incorrect tenant ${apt.tenantId}.`);
        }
        const serviceExists = services.some(s => s.id === apt.serviceId);
        if (!serviceExists) {
            result.warnings.push(`Appointment ${apt.id} references non-existent service ${apt.serviceId}`);
        }
    });

    // Branches validation
    const branches = snapshot.branches || [];
    branches.forEach(b => {
        if (!b.tenantId) {
           result.warnings.push(`Branch ${b.id || 'unknown'} is missing tenantId attribute.`);
        }
    });

    // Customers validation
    const customers = snapshot.customers || [];
    customers.forEach(c => {
       if (!c.tenantId && account?.id) {
          result.warnings.push(`Customer metadata for ${c.fullName || c.id} does not explicitly hold a tenant_id tag.`);
       }
    });

    // 6. Communication Log Validations
    const onboarding = snapshot.onboardingState || {};
    // Mock simulation for message outbox check
    const commEvents = (onboarding.communicationEvents || []) as any[];
    commEvents.forEach((ev, idx) => {
       if (!ev.tenantId) {
          result.warnings.push(`Communication log entry #${idx} is missing a tenant_id.`);
       }
       if (!ev.audience || !ev.channel || !ev.status) {
          result.warnings.push(`Communication log entry #${idx} has incomplete tracking fields (audience, channel, status).`);
       }
    });

    // Resolution
    if (result.blockers.length === 0) {
      result.ready = true;
    }

    return result;
  }
};
