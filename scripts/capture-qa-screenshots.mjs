import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

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
  { name: 'Admin Dashboard', path: '/admin' },
  // { name: 'Admin Site Preview', path: '/admin/site-preview' },
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
];

async function captureScreenshots() {
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
  await page.goto(`${BASE_URL}/`);
  await page.waitForLoadState('networkidle');

  // Ensure devtools param to hide/show panel
  const getUrl = (p) => `${BASE_URL}/#${p}${p.includes('?') ? '&' : '?'}devTools=${DEVTOOLS ? '1' : '0'}&lang=tr`;

  const capture = async (group, viewportName, route) => {
    await page.setViewportSize(VIEWPORTS[viewportName]);
    await page.goto(getUrl(route.path));
    await page.waitForLoadState('networkidle');
    await delay(1000); // Give React time to render

    const filename = `${group}-${route.name.replace(/\\s+/g, '-').toLowerCase()}-${viewportName}.png`;
    const filepath = path.join(OUT_DIR, viewportName, filename);

    await page.screenshot({ path: filepath, fullPage: true });
    
    reportItems.push({
      group,
      name: route.name,
      path: route.path,
      viewport: viewportName,
      file: `${viewportName}/${filename}`
    });
    console.log(`📸 Captured: ${route.name} (${viewportName})`);
  };

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
  await page.evaluate(() => {
    localStorage.setItem('randapp_customer_profile_tenant_demo', JSON.stringify({
      id: "cust_demo", phone: "5551234567", name: "Demo User", email: "demo@user.com"
    }));
  });
  for (const route of CUSTOMER_AUTH_ROUTES) {
    await capture('Customer', 'desktop', route);
    await capture('Customer', 'mobile', route);
  }

  // 3. Admin
  await page.evaluate(() => {
    localStorage.setItem('randapp_mock_user', JSON.stringify({
      id: "usr_admin", name: "Cemil Kaya", email: "admin@randapp.com", role: "admin", tenantId: "tenant_demo"
    }));
  });
  for (const route of ADMIN_ROUTES) {
    await capture('Admin', 'desktop', route);
    await capture('Admin', 'mobile', route);
  }

  // 4. Super Admin
  await page.evaluate(() => {
    localStorage.setItem('randapp_mock_user', JSON.stringify({
      id: "usr_super", name: "Super Admin", email: "superadmin@randapp.com", role: "super_admin", tenantId: "tenant_platform"
    }));
  });
  for (const route of SUPER_ADMIN_ROUTES) {
    await capture('Super Admin', 'desktop', route);
    await capture('Super Admin', 'mobile', route);
  }

  await browser.close();

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
  <p>Screenshots captured at: ${new Date().toLocaleString()}</p>
  
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
