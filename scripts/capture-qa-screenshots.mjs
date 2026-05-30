import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const BASE_URL = process.env.QA_BASE_URL || 'http://localhost:3000';
const OUT_DIR = path.join(process.cwd(), 'qa-screenshots');
const DEVTOOLS = process.env.QA_INCLUDE_DEVTOOLS === 'true';

const VIEWPORTS = {
  mobile: { width: 390, height: 844 },
  desktop: { width: 1440, height: 1000 },
};

const MARKETING_ROUTES = [
  { name: 'Home', path: '/' },
  { name: 'Features', path: '/features' },
  { name: 'Pricing', path: '/pricing' },
  { name: 'Mobile App', path: '/mobile-app' },
  { name: 'Contact', path: '/contact' },
  { name: 'Demo Landing', path: '/demo' },
  { name: 'Login', path: '/login' },
];

const CUSTOMER_ROUTES = [
  { name: 'Book Appointment', path: '/book' },
  { name: 'Customer Login', path: '/customer/login' },
];

// Routes requiring Customer Auth
const CUSTOMER_AUTH_ROUTES = [
  { name: 'Customer Portal', path: '/customer/appointments' },
]

const ADMIN_ROUTES = [
  { name: 'Admin Dashboard', path: '/admin/dashboard' },
  { name: 'Admin Setup', path: '/admin/setup' },
  { name: 'Admin Appointments', path: '/admin/appointments' },
  { name: 'Admin Customers', path: '/admin/customers' },
  { name: 'Admin Services', path: '/admin/services' },
  { name: 'Admin Staff', path: '/admin/staff' },
  { name: 'Admin Profile', path: '/admin/profile' },
  { name: 'Admin Referrals', path: '/admin/referrals' },
  { name: 'Admin Reports', path: '/admin/reports' },
  { name: 'Admin Billing', path: '/admin/billing' },
  { name: 'Admin Settings', path: '/admin/settings' },
  { name: 'Admin Site Preview', path: '/admin/site-preview' }
];

const SUPER_ADMIN_ROUTES = [
  { name: 'SA Dashboard', path: '/super-admin' },
  { name: 'SA Tenants', path: '/super-admin/tenants' },
  { name: 'SA Subscriptions', path: '/super-admin/subscriptions' },
  { name: 'SA Payments', path: '/super-admin/payments' },
  { name: 'SA Onboarding', path: '/super-admin/onboarding' },
  { name: 'SA Reports', path: '/super-admin/reports' },
  { name: 'SA Settings', path: '/super-admin/settings' },
  { name: 'SA Payment Test', path: '/super-admin/payment-test' },
  { name: 'SA AI Settings', path: '/super-admin/ai-settings' },
  { name: 'SA Plans', path: '/super-admin/plans' },
  { name: 'SA Referrals', path: '/super-admin/referrals' },
  { name: 'SA Tenant Preview', path: '/super-admin/tenant-preview/tenant_demo' }
];

async function captureScreenshots() {
  // Total routes calculation
  const allRoutes = [...MARKETING_ROUTES, ...CUSTOMER_ROUTES, ...CUSTOMER_AUTH_ROUTES, ...ADMIN_ROUTES, ...SUPER_ADMIN_ROUTES];
  const expectedRouteCount = allRoutes.length;
  const expectedScreenshotCount = expectedRouteCount * 2; // mobile + desktop
  const skippedRoutes = []; // We didn't intentionally skip any supported pilot routes based on App.tsx, but if we did, add here.

  console.log(`Starting QA Screenshot Capture to ${OUT_DIR}...`);
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
  if (!fs.existsSync(path.join(OUT_DIR, 'mobile'))) fs.mkdirSync(path.join(OUT_DIR, 'mobile'), { recursive: true });
  if (!fs.existsSync(path.join(OUT_DIR, 'desktop'))) fs.mkdirSync(path.join(OUT_DIR, 'desktop'), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  const reportItems = [];

  const delay = (ms) => new Promise(res => setTimeout(res, ms));

  // Visit a dummy route to ensure localStorage can be set easily on that origin
  try {
    await page.goto(`${BASE_URL}/`);
    await page.waitForLoadState('networkidle');
  } catch(e) {
    console.error("Could not reach BASE_URL:", BASE_URL, e);
  }

  // Ensure devtools param to hide/show panel
  const getUrl = (p) => `${BASE_URL}/#${p}${p.includes('?') ? '&' : '?'}devTools=${DEVTOOLS ? '1' : '0'}&lang=tr`;

  const capture = async (group, viewportName, route) => {
    try {
      await page.setViewportSize(VIEWPORTS[viewportName]);
      await page.goto(getUrl(route.path));
      await page.waitForLoadState('networkidle');
      await delay(1500); // Give React time to render
      
      const pageText = await page.evaluate(() => document.body.innerText);
      let failedAssertion = null;
      if (group === 'Admin' && pageText.includes('Yönetici Girişi') && !route.path.includes('login')) {
         failedAssertion = "Admin page shows login screen";
      }
      if (group === 'Super Admin' && pageText.includes('Yönetici Girişi') && !route.path.includes('login')) {
         failedAssertion = "Super Admin page shows login screen";
      }
      if (route.path === '/customer/appointments' && pageText.includes('Randevu Panelinize Giriş Yapın')) {
         failedAssertion = "Customer portal shows login screen";
      }
      if (route.path === '/book' && pageText.includes('Hesap Askıda')) {
         failedAssertion = "Booking page shows suspended state";
      }

      if (failedAssertion) {
         throw new Error(`Assertion failed: ${failedAssertion}`);
      }

      const filename = `${group.replace(/\\s+/g, '')}-${route.name.replace(/\\s+/g, '-').toLowerCase()}-${viewportName}.png`;
      const filepath = path.join(OUT_DIR, viewportName, filename);

      await page.screenshot({ path: filepath, fullPage: true });
      
      const fileBuffer = fs.readFileSync(filepath);
      const hash = crypto.createHash('md5').update(fileBuffer).digest('hex');

      reportItems.push({
        group,
        name: route.name,
        path: route.path,
        viewport: viewportName,
        file: `${viewportName}/${filename}`,
        hash
      });
      console.log(`📸 Captured: ${route.name} (${viewportName})`);
    } catch(err) {
      console.error(`Failed to capture ${route.name} (${viewportName}):`, err);
      skippedRoutes.push({ name: `${route.name} (${viewportName})`, reason: err.message });
    }
  };

  // Inject go_live_status for demo tenant so /book works
  await page.evaluate(() => {
    localStorage.setItem('randapp:tenant_demo:go_live_status', '"live"');
    localStorage.setItem('randapp:tenant_demo:provisioning_status', '"live"');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');

  // 1. Marketing
  for (const route of MARKETING_ROUTES) {
    await capture('Marketing', 'desktop', route);
    await capture('Marketing', 'mobile', route);
  }

  // 2. Customer
  for (const route of CUSTOMER_ROUTES) {
    await capture('Customer', 'desktop', route);
    await capture('Customer', 'mobile', route);
  }
  
  // 2b. Customer (Auth Required)
  await page.goto(`${BASE_URL}/`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    localStorage.setItem('randapp_customer_profile_tenant_demo', JSON.stringify({
      id: "cust_demo", phone: "5551234567", name: "Demo User", email: "demo@user.com"
    }));
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  for (const route of CUSTOMER_AUTH_ROUTES) {
    await capture('Customer', 'desktop', route);
    await capture('Customer', 'mobile', route);
  }

  // 3. Admin
  await page.goto(`${BASE_URL}/`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    localStorage.setItem('randapp_mock_user', JSON.stringify({
      id: "usr_admin", name: "Cemil Kaya", email: "admin@randapp.com", role: "salon_owner", tenantId: "tenant_demo"
    }));
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  for (const route of ADMIN_ROUTES) {
    await capture('Admin', 'desktop', route);
    await capture('Admin', 'mobile', route);
  }

  // 4. Super Admin
  await page.goto(`${BASE_URL}/`);
  await page.waitForLoadState('networkidle');
  await page.evaluate(() => {
    localStorage.setItem('randapp_mock_user', JSON.stringify({
      id: "usr_super", name: "Super Admin", email: "superadmin@randapp.com", role: "super_admin", tenantId: "tenant_platform"
    }));
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  for (const route of SUPER_ADMIN_ROUTES) {
    await capture('Super Admin', 'desktop', route);
    await capture('Super Admin', 'mobile', route);
  }

  await browser.close();

  // Duplicate detection
  const hashGroups = {};
  reportItems.forEach(item => {
    if (!hashGroups[item.hash]) hashGroups[item.hash] = [];
    hashGroups[item.hash].push(item);
  });

  const duplicateGroups = Object.values(hashGroups).filter(group => group.length > 2);
  const badDuplicates = []; // We allow identical mobile/desktop pairings if they really are, but not whole groups

  reportItems.forEach(item => {
     const sameGroupHashes = hashGroups[item.hash].filter(i => i.group === item.group && i.viewport === item.viewport);
     if (sameGroupHashes.length > 3) {
         // E.g. all 12 admin routes look exactly the same
         badDuplicates.push(`Found ${sameGroupHashes.length} identical screenshots for ${item.group} (${item.viewport})`);
     }
  });

  const uniqueBadDuplicates = [...new Set(badDuplicates)];
  if (uniqueBadDuplicates.length > 0) {
      console.error("❌ QA Failed due to unacceptable screenshot duplication (likely a login wall)");
      uniqueBadDuplicates.forEach(msg => console.error(msg));
      skippedRoutes.push({ name: "DUPLICATES", reason: uniqueBadDuplicates.join("; ") });
  }

  // Generate HTML Report
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Randapp QA Screenshot Report</title>
  <style>
    body { font-family: system-ui, sans-serif; background: #f9fafb; color: #111827; padding: 2rem; margin: 0; }
    h1 { border-bottom: 2px solid #e5e7eb; padding-bottom: 0.5rem; }
    .summary { background: #eff6ff; padding: 1.5rem; border-radius: 0.5rem; border: 1px solid #bfdbfe; margin-bottom: 2rem; }
    .summary h2 { margin-top: 0; }
    .summary ul { margin: 0; padding-left: 1.5rem; }
    .skipped { background: #fefce8; padding: 1rem; border-radius: 0.5rem; border: 1px solid #fef08a; margin-bottom: 2rem; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; margin-top: 2rem; }
    .card { background: white; border-radius: 0.5rem; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
    .card-header { padding: 1rem; border-bottom: 1px solid #e5e7eb; background: #f3f4f6; }
    .card-header h3 { margin: 0; font-size: 1.1rem; }
    .card-header p { margin: 0.2rem 0 0; font-size: 0.85rem; color: #4b5563; }
    .img-container { padding: 1rem; background: #e5e7eb; display: flex; justify-content: center; }
    img { max-width: 100%; height: auto; border: 1px solid #d1d5db; border-radius: 0.25rem; }
  </style>
</head>
<body>
  <h1>Randapp QA Screenshot Report</h1>
  <div class="summary">
    <h2>Summary</h2>
    <ul>
      <li><strong>Date:</strong> ${new Date().toLocaleString()}</li>
      <li><strong>Expected Routes:</strong> ${expectedRouteCount}</li>
      <li><strong>Expected Screenshots:</strong> ${expectedScreenshotCount} (Mobile + Desktop)</li>
      <li><strong>Captured Screenshots:</strong> ${reportItems.length}</li>
      <li><strong>Identical Clusters:</strong> ${duplicateGroups.length}</li>
    </ul>
  </div>
  ${skippedRoutes.length > 0 ? `
  <div class="skipped">
    <h3>Skipped Routes</h3>
    <ul>
      ${skippedRoutes.map(sr => `<li><strong>${sr.name}:</strong> ${sr.reason}</li>`).join('')}
    </ul>
  </div>` : ''}
  
  <div class="grid">
    ${reportItems.map(item => `
      <div class="card">
        <div class="card-header">
          <h3>${item.group} - ${item.name} (${item.viewport})</h3>
          <p>Path: <code>${item.path}</code></p>
        </div>
        <div class="img-container">
          <a href="${item.file}" target="_blank">
            <img src="${item.file}" alt="${item.name}" loading="lazy" />
          </a>
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>
  `.trim();

  fs.writeFileSync(path.join(OUT_DIR, 'QA_SCREENSHOT_REPORT.html'), htmlContent);
  console.log('\\n📊 Summary:');
  console.log(`- Expected Routes: ${expectedRouteCount}`);
  console.log(`- Expected Screenshots: ${expectedScreenshotCount}`);
  console.log(`- Captured Screenshots: ${reportItems.length}`);
  console.log('✅ Generated QA_SCREENSHOT_REPORT.html');

  // Generate README.md
  const readmeContent = `
# Randapp Automated QA Screenshots

This folder contains automatically captured screenshots of the Randapp application for QA purposes.

## How to Capture
Run from the project root:
\`\`\`bash
npm run qa:screenshots
\`\`\`
*(Ensure the local dev server is running on localhost:3000 or configure QA_BASE_URL)*

## Outputs
- \`mobile/\` - Contains 390x844 viewports
- \`desktop/\` - Contains 1440x1000 viewports
- \`QA_SCREENSHOT_REPORT.html\` - Visual review dashboard

## Priority Review Order
1. Homepage (\`/\`)
2. Pricing (\`/pricing\`)
3. Booking Flow (\`/book\`)
4. Booking Success (if generated)
5. Admin Mobile (\`/admin\`)
6. Admin Settings
7. Super Admin Mobile (\`/super-admin\`)
8. Payment Diagnostics (\`/super-admin/payment-test\`)

## Known Limitations
- Modals that require interaction to open are not captured automatically in this pass.
- Timeouts might occasionally cut off images loading if network is slow. Re-run if a screenshot looks empty.
  `.trim();

  fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readmeContent);
  console.log('✅ Generated README.md');
  console.log('🎉 Screenshot Capture Complete!');
}

captureScreenshots().catch(console.error);
