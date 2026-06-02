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

    // 1. Data existence
    if (!snapshot.tenantAccount) {
      result.blockers.push("Tenant Account object is missing.");
    }
    
    // 2. Profile basics
    if (!snapshot.businessProfile?.name) {
      result.blockers.push("Business profile lacks a name.");
    } else {
       if (!snapshot.businessProfile.slug) {
         result.warnings.push("Business profile is missing a public URL slug.");
         result.recommendedFixes.push("Set a public URL slug in the Admin -> Website/Settings tab.");
       }
    }

    // 3. Catalog validations
    const services = snapshot.catalog?.services || [];
    const staff = snapshot.catalog?.staff || [];
    
    if (services.length === 0) {
      result.blockers.push("Business has no services defined.");
    }
    
    if (staff.length === 0) {
      result.blockers.push("Business has no staff defined.");
    }

    // 4. Session & Secrecy Validations (Safety Net)
    // Ensure we aren't migrating active owner sessions
    const snapshotString = JSON.stringify(snapshot);
    if (snapshotString.includes('"password"') || snapshotString.includes('"hashedPassword"')) {
       result.blockers.push("Snapshot contains password fields which cannot be migrated.");
    }
    if (snapshotString.includes('"cardNumber"') || snapshotString.includes('"cvv"')) {
       result.blockers.push("Snapshot contains prohibited raw card data structures.");
    }

    // 5. Relational integrity
    const appointments = snapshot.appointments || [];
    appointments.forEach(apt => {
        const serviceExists = services.some(s => s.id === apt.serviceId);
        if (!serviceExists) {
            result.warnings.push(`Appointment ${apt.id} references non-existent service ${apt.serviceId}`);
        }
    });

    const campaigns = snapshot.campaigns || [];
    const rewards = snapshot.campaignRewards || [];
    rewards.forEach(r => {
        const campExists = campaigns.some(c => c.id === r.campaignId);
        if (!campExists) {
           result.warnings.push(`Campaign reward ${r.id} references non-existent campaign ${r.campaignId}`);
        }
    });

    // Resolution
    if (result.blockers.length === 0) {
      result.ready = true;
    }

    return result;
  }
};
