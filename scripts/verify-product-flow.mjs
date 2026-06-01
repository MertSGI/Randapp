import fs from 'fs';
import path from 'path';

const FORBIDDEN_WORDS = [
  'mock',
  'demo payment',
  'payment disabled',
  'not configured',
  'sandbox',
  'planned',
  'roadmap',
  'coming soon',
  'yakında',
  'planlanan',
  'yol haritası',
  'gelecekte'
];

const ALLOWED_MOCK_FILES = [
  'MockDiagnosticTool.tsx',
  'SuperAdminSettingsPage.tsx',
  'demoSeeder.ts',
  'mockDb.ts',
  'tenantSettingsService.ts'
];

const BRANDING_CHECK = 'Randapp';

// Sensitive keys
const FORBIDDEN_SECRETS = [
  'IYZICO_SECRET_KEY',
  'SUPABASE_SERVICE_ROLE_KEY'
];

// Folders to check
const DIRS_TO_CHECK = ['pages', 'components', 'utils', 'services', 'contexts'];

const results = {
  forbiddenWording: [],
  oldBranding: [],
  secretsFound: [],
  rawCardInputs: [],
};

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath, callback);
    } else {
      if (filePath.endsWith('.ts') || filePath.endsWith('.tsx') || filePath.endsWith('.js') || filePath.endsWith('.jsx')) {
        callback(filePath);
      }
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lowerContent = content.toLowerCase();
  
  // 1. Forbidden wording (skip allowed mock files or admin/super admin files)
  if (!filePath.toLowerCase().includes('superadmin') && 
      !filePath.toLowerCase().includes('diagnostic') &&
      !ALLOWED_MOCK_FILES.some(f => filePath.includes(f))) {
    FORBIDDEN_WORDS.forEach(word => {
      // Need to avoid matching 'mock' inside words like 'mockDb' but simple match first
      // Let's do a regex boundary check for English words?
      // Just check if the string contains the exact wording for phrases
        const textMatches = content.match(/>([^<]+)</g);
        if (textMatches) {
          const textContent = textMatches.map(m => m.slice(1, -1)).join(' ');
          const regex = new RegExp(`\\b${word}\\b`, 'i');
          if (regex.test(textContent)) {
            results.forbiddenWording.push({ file: filePath, word });
          }
        }
    });
  }

  // 2. Branding Check (allow in some internal logic like admin emails or api, but flag if found in customer text)
  // Let's just flag all instances of Randapp and manually review.
  if (lowerContent.includes('randapp')) {
    results.oldBranding.push({ file: filePath });
  }

  // 3. Secrets
  FORBIDDEN_SECRETS.forEach(secret => {
    if (content.includes(secret)) {
      results.secretsFound.push({ file: filePath, secret });
    }
  });

  // 4. Raw card inputs (e.g. name="cardNumber", id="cvv", etc)
  const ccRegex = /name=["']?(cardNumber|cvv|expiry)["']?/i;
  if (ccRegex.test(content)) {
    results.rawCardInputs.push({ file: filePath });
  }
}

// Ensure output dir
if (!fs.existsSync('qa-reports')) {
  fs.mkdirSync('qa-reports');
}

DIRS_TO_CHECK.forEach(dir => walkDir(dir, checkFile));

let report = `# Product Flow QA Report

## Summary
- **Forbidden Wording Found:** ${results.forbiddenWording.length}
- **Old Branding (Randapp) Found:** ${results.oldBranding.length}
- **Frontend Secrets Exposed:** ${results.secretsFound.length}
- **Raw Card Inputs Detected:** ${results.rawCardInputs.length}

## Details

### Forbidden Customer-Facing Wording
${results.forbiddenWording.map(f => `- ${f.file}: "${f.word}"`).join('\n') || 'None detected.'}

### Old Branding (Randapp) Remaining
${results.oldBranding.map(f => `- ${f.file}`).join('\n') || 'None detected.'}

### Frontend Secrets Exposed
${results.secretsFound.map(f => `- ${f.file}: ${f.secret}`).join('\n') || 'None detected.'}

### Raw Card Inputs Detected
${results.rawCardInputs.map(f => `- ${f.file}`).join('\n') || 'None detected.'}
`;

fs.writeFileSync('qa-reports/PRODUCT_FLOW_QA_REPORT.md', report);
console.log('Product flow QA script completed. Report generated at qa-reports/PRODUCT_FLOW_QA_REPORT.md');
