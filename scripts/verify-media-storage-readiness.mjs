import fs from 'fs';
import path from 'path';

console.log('========================================================================');
console.log('   LARİ MEDIA STORAGE & ASSET HANDLING READINESS VALIDATION RUN');
console.log('========================================================================');

let failureCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    failureCount++;
  }
}

// 1. Verify Documentation Files
const opsDocPath = path.resolve('docs/MEDIA_STORAGE_AND_ASSET_OPERATIONS.md');
assert(fs.existsSync(opsDocPath), 'opsDocPath file exists: docs/MEDIA_STORAGE_AND_ASSET_OPERATIONS.md');
if (fs.existsSync(opsDocPath)) {
  const content = fs.readFileSync(opsDocPath, 'utf8');
  assert(content.includes('lari-public-media'), 'opsDocPath references public bucket name "lari-public-media"');
  assert(content.includes('lari-private-secure'), 'opsDocPath references private bucket name "lari-private-secure"');
  assert(content.includes('S3_SECRET_ACCESS_KEY'), 'opsDocPath references S3 configuration keys');
  assert(content.includes('KVKK & GDPR'), 'opsDocPath references privacy boundaries and consent forms');
}

const matrixDocPath = path.resolve('docs/MEDIA_STORAGE_PROVIDER_CONTRACT_MATRIX.md');
assert(fs.existsSync(matrixDocPath), 'matrixDocPath file exists: docs/MEDIA_STORAGE_PROVIDER_CONTRACT_MATRIX.md');
if (fs.existsSync(matrixDocPath)) {
  const content = fs.readFileSync(matrixDocPath, 'utf8');
  assert(content.includes('logo'), 'matrixDocPath defines rows for branding logo');
  assert(content.includes('cover image'), 'matrixDocPath defines rows for cover image');
  assert(content.includes('internal support attachment'), 'matrixDocPath defines rows for internal support attachments');
}

// 2. Verify Schema Adaptations
const schemaPath = path.resolve('docs/SUPABASE_SCHEMA.md');
if (fs.existsSync(schemaPath)) {
  const content = fs.readFileSync(schemaPath, 'utf8');
  assert(content.includes('Media Assets'), 'SUPABASE_SCHEMA.md has been updated to include Media Assets schemas');
}

const rlsPath = path.resolve('docs/RLS_POLICY_PLAN.md');
if (fs.existsSync(rlsPath)) {
  const content = fs.readFileSync(rlsPath, 'utf8');
  assert(content.includes('storage.objects'), 'RLS_POLICY_PLAN.md covers storage bucket object permissions');
  assert(content.includes('lari-private-secure'), 'RLS_POLICY_PLAN.md covers private storage bucket restrictions');
}

// 3. Verify Code definitions (types, services)
const typesPath = path.resolve('types.ts');
if (fs.existsSync(typesPath)) {
  const content = fs.readFileSync(typesPath, 'utf8');
  assert(content.includes('MediaAsset'), 'types.ts defines MediaAsset interface');
  assert(content.includes('MediaVisibility'), 'types.ts defines MediaVisibility enum/type');
}

const servicePath = path.resolve('services/mediaAssetService.ts');
assert(fs.existsSync(servicePath), 'mediaAssetService file exists');
if (fs.existsSync(servicePath)) {
  const content = fs.readFileSync(servicePath, 'utf8');
  assert(content.includes('createLocalPreviewAsset'), 'mediaAssetService defines createLocalPreviewAsset');
  assert(content.includes('validateMediaAssetForMigration'), 'mediaAssetService defines validateMediaAssetForMigration');
}

// 4. Test Dry-Run validations (Dynamic run-tests using migrationDryRunService)
import('../services/migrationDryRunService.js')
  .then(module => {
     const migrationDryRunService = module.migrationDryRunService;
     
     // Construct virtual snapshot
     const mockSnapshot = {
        snapshotVersion: 'lari-local-v1',
        tenantId: 'tenant-123',
        tenantAccount: {
           id: 'tenant-123',
           email: 'test@randevulari.com',
           slug: 'test-salon',
           isPublished: true,
           publicSiteStatus: 'active'
        },
        businessProfile: {
           id: 'tenant-123',
           tenant_id: 'tenant-123',
           is_public_profile_enabled: true,
           logo_url: 'data:image/png;base64,mocklogo',
           cover_image_url: 'http://example.com/cover.jpg'
        },
        mediaAssets: [
           {
              id: 'asset-1',
              tenantId: 'tenant-123',
              fileName: 'logo.png',
              sizeBytes: 100 * 1024,
              mimeType: 'image/png',
              visibility: 'public',
              localPreviewUrl: 'data:image/png;base64,mocklogo',
              status: 'active'
           },
           {
              id: 'asset-invalid-tenant',
              tenantId: 'tenant-wrong',
              fileName: 'portrait.jpg',
              sizeBytes: 2 * 1024 * 1024,
              mimeType: 'image/jpeg',
              visibility: 'public',
              status: 'active'
           },
           {
              id: 'asset-huge',
              tenantId: 'tenant-123',
              fileName: 'high_res_salon.png',
              sizeBytes: 8 * 1024 * 1024, // 8MB - over maximum 5MB limit
              mimeType: 'image/png',
              visibility: 'public',
              status: 'active'
           },
           {
              id: 'asset-unsafe',
              tenantId: 'tenant-123',
              fileName: 'dangerous_script.svg',
              sizeBytes: 10 * 1024,
              mimeType: 'image/svg+xml',
              visibility: 'public',
              status: 'active'
           }
        ]
     };

     const dryRunResult = migrationDryRunService.validateSnapshotForMigration(mockSnapshot);
     
     console.log('\n--- DRY RUN SANITY RESULTS ---');
     console.log('Ready status:', dryRunResult.ready);
     console.log('Blockers detected:', dryRunResult.blockers.length);
     console.log('Warnings detected:', dryRunResult.warnings.length);
     
     dryRunResult.blockers.forEach(b => console.log(' [BLOCKER]', b));
     dryRunResult.warnings.forEach(w => console.log(' [WARNING]', w));

     // Assertions on the Dry-Run Logic
     assert(!dryRunResult.ready, 'Dry-run fails because snapshot has blockers');
     assert(dryRunResult.blockers.some(b => b.includes('yanlış tenantId')), 'Blocker catches wrong tenantId mapping');
     assert(dryRunResult.blockers.some(b => b.includes('5 MB sınırını aşıyor')), 'Blocker catches over-sized images');
     assert(dryRunResult.blockers.some(b => b.includes('güvenlik filtresine takıldı')), 'Blocker catches unsafe file types or SVG scripts');
     assert(dryRunResult.warnings.some(w => w.includes('Erişilebilirlik (SEO)')), 'Warning flags missing image alt texts');
     assert(dryRunResult.warnings.some(w => w.includes('ham base64 verisi taşıyor')), 'Warning flags huge inline base64 blobs');
     assert(dryRunResult.warnings.some(w => w.includes('harici/statik bir URL referansıdır')), 'Warning flags reference images not stored in lari kütüphanesi');

     finish();
  })
  .catch(err => {
     console.error('Failed to dynamic import migrationDryRunService:', err);
     failureCount++;
     finish();
  });

function finish() {
  console.log('\n========================================================================');
  if (failureCount === 0) {
    console.log('   ALL SYSTEM MEDIA STORAGE CHECKS COMPLETED IN GREEN STATE!');
    console.log('========================================================================');
    process.exit(0);
  } else {
    console.error(`   MEDIA STORAGE VERIFICATION FAILED WITH ${failureCount} FAILURES!`);
    console.log('========================================================================');
    process.exit(1);
  }
}
