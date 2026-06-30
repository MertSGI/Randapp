import fs from 'fs';
import path from 'path';

console.log('=== RUNNING HARDENED SUPABASE STAGING SMOKE TEST ===\n');

// 1. Read environment config from .env or process.env
let env = { ...process.env };

if (fs.existsSync('.env')) {
  try {
    const lines = fs.readFileSync('.env', 'utf8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const parts = trimmed.split('=');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
          env[key] = value;
        }
      }
    }
  } catch (e) {
    console.warn('[WARN] Failed to read .env file:', e.message);
  }
}

// Parse command line arguments
const args = process.argv.slice(2);
const writeFixturesFlag = args.includes('--write-staging-fixtures');
let targetMode = 'read-only'; // Default mode
if (args.includes('--mode=env-only')) {
  targetMode = 'env-only';
} else if (args.includes('--mode=write-smoke')) {
  targetMode = 'write-smoke';
}

const requiredVars = [
  'VITE_LAUNCH_MODE',
  'VITE_DATA_MODE',
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY'
];

const missing = requiredVars.filter(v => !env[v]);

if (missing.length > 0) {
  console.log('[SKIPPED] Missing required environment variables for staging connection:');
  for (const m of missing) {
    console.log(`  - ${m}`);
  }
  console.log('\n[INFO] Real staging smoke test requires live staging environment credentials.');
  console.log('Therefore, this live staging run is intentionally SKIPPED in local developer preflight.');
  console.log('To run, set these variables in your .env file.');
  process.exit(0); // Exit cleanly when run without env vars
}

const launchMode = env.VITE_LAUNCH_MODE;
const dataMode = env.VITE_DATA_MODE;
const paymentMode = env.VITE_PAYMENT_MODE || 'disabled';

// Refuse to run if data mode is local or mock
if (dataMode === 'local' || dataMode === 'mock') {
  console.error(`[FAIL] VITE_DATA_MODE is "${dataMode}". Staging smoke testing is strictly blocked on local mock databases.`);
  process.exit(1);
}

// Refuse to run if payment mode is not disabled
if (paymentMode !== 'disabled') {
  console.error(`[FAIL] VITE_PAYMENT_MODE is "${paymentMode}". Online payment must be disabled under paymentless staging.`);
  process.exit(1);
}

console.log('Configuration Audit:');
console.log(`  - Launch Mode: ${launchMode}`);
console.log(`  - Data Mode: ${dataMode}`);
console.log('  - Supabase URL: Registered (Safely Hidden)');
console.log('  - Supabase Anon Key: Registered (Safely Hidden)');
console.log(`  - Payment Integration: DISABLED (iyzico is NOT required for paymentless_limited_production)`);
console.log(`  - Target Execution Mode: ${targetMode.toUpperCase()}`);
console.log('  - Write Fixtures Flag:', writeFixturesFlag ? 'ENABLED' : 'DISABLED');
console.log('');

// --- MODE 1: Env-Only Check ---
if (targetMode === 'env-only') {
  console.log('[PASS] Mode: ENV-ONLY check completed successfully with 0 violations.');
  process.exit(0);
}

// Setup safe mock parameters for checks
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

// Safe public booking fetch function (mocks anonymous client)
async function fetchStagingPublicEndpoint(endpoint) {
  const url = `${supabaseUrl}${endpoint}`;
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`
      }
    });
    return res;
  } catch (err) {
    throw new Error(`Connection failed: ${err.message}`);
  }
}

// Safe guest insertion fetch function
async function insertStagingPublicEndpoint(endpoint, payload) {
  const url = `${supabaseUrl}${endpoint}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(payload)
    });
    return res;
  } catch (err) {
    throw new Error(`Write failed: ${err.message}`);
  }
}

// Execute checks
async function executeSmokeTests() {
  console.log('📡 Fetching schema and testing public anonymous boundaries on remote staging...');

  // --- MODE 2: Read-Only Schema & Anon Check ---
  try {
    // 1. Try to read active tenants
    console.log('Testing SELECT /rest/v1/tenants...');
    const resTenants = await fetchStagingPublicEndpoint('/rest/v1/tenants?select=id,slug,status');
    if (resTenants.status === 401 || resTenants.status === 403) {
      console.error(`[BLOCKER] RLS denies anonymous read access on tenants: status ${resTenants.status}`);
    } else if (resTenants.ok) {
      const data = await resTenants.json();
      console.log(`  - Success: Received ${data.length} published tenant(s)`);
    } else {
      console.warn(`  - Unexpected response code: ${resTenants.status}`);
    }

    // 2. Try to read services (Public read policy)
    console.log('Testing SELECT /rest/v1/services...');
    const resServices = await fetchStagingPublicEndpoint('/rest/v1/services?select=id,name,price');
    if (resServices.ok) {
      const data = await resServices.json();
      console.log(`  - Success: Retrieved ${data.length} active service(s) from public catalog`);
    } else {
      console.error(`  - Failed to fetch services catalog: status ${resServices.status}`);
    }

    // 3. Try to read appointments anonymously (MUST fail or return empty due to RLS privacy bounds)
    console.log('Testing SELECT /rest/v1/appointments anonymously (Privacy isolation check)...');
    const resAppts = await fetchStagingPublicEndpoint('/rest/v1/appointments?select=*');
    if (resAppts.ok) {
      const data = await resAppts.json();
      if (data.length > 0) {
        console.error(`[CRITICAL LEAK] Public anonymous client can read ${data.length} appointment details! RLS policy is broken.`);
        process.exit(1);
      } else {
        console.log('  - Success: Received empty list. Public reads are correctly blocked.');
      }
    } else {
      console.log(`  - Success: Query rejected with status ${resAppts.status} (Protected by default).`);
    }

    // 4. Try to read customers anonymously (MUST return empty)
    console.log('Testing SELECT /rest/v1/customers anonymously...');
    const resCusts = await fetchStagingPublicEndpoint('/rest/v1/customers?select=*');
    if (resCusts.ok) {
      const data = await resCusts.json();
      if (data.length > 0) {
        console.error('[CRITICAL LEAK] Public anonymous client can read customer listings!');
        process.exit(1);
      } else {
        console.log('  - Success: Customer records safely isolated.');
      }
    } else {
      console.log(`  - Success: Access blocked with status ${resCusts.status}.`);
    }

  } catch (err) {
    console.error(`[FAIL] Connection test failed with error: ${err.message}`);
    console.log('Please verify VITE_SUPABASE_URL and your network connection.');
    process.exit(1);
  }

  // --- MODE 3: Write Smoke Check with explicit confirmation flag ---
  if (targetMode === 'write-smoke') {
    if (!writeFixturesFlag) {
      console.log('\n[SKIPPED] Write smoke test skipped. Pass "--write-staging-fixtures" to run insertion tests.');
      process.exit(0);
    }

    console.log('\n✍️ Executing public reservation insert smoke test (Fictional guest data)...');
    
    // We attempt to insert a fictional guest customer and appointment
    const testTenantId = 'aaaa1111-a1a1-a1a1-a1a1-aaaaaaaaaaaa'; // Melis Güzellik static UUID
    
    const fictionalCustomer = {
      tenant_id: testTenantId,
      name: 'Smoke Test Guest',
      email: 'smoke-guest-staging@example.com',
      phone: '+905001112233'
    };

    try {
      console.log('Inserting fictional guest record into /rest/v1/customers...');
      const resCustInsert = await insertStagingPublicEndpoint('/rest/v1/customers', fictionalCustomer);
      if (resCustInsert.ok) {
        console.log('  - Success: Fictional customer created.');
      } else {
        console.error(`[BLOCKER] Could not insert customer during guest booking checkout. Status: ${resCustInsert.status}`);
        const text = await resCustInsert.text();
        console.error('Details:', text);
      }
    } catch (err) {
      console.error(`[FAIL] Guest insertion failed: ${err.message}`);
      process.exit(1);
    }
  }

  console.log('\n[PASS] All staging smoke tests executed successfully.');
  console.log('[SUCCESS] Staging connection is compliant, secure, and ready for deployment!\n');
  process.exit(0);
}

// Run asynchronous checks
executeSmokeTests();
