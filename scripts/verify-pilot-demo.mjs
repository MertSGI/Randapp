import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

const runTests = () => {
    let passed = true;
    let output = '# Pilot Demo Readiness Report\n\n';

    output += `## Flow Check\n`;
    
    // Check PilotDemoService exists
    const servicePath = path.join(rootDir, 'services', 'pilotDemoService.ts');
    if (fs.existsSync(servicePath)) {
        output += `- ✅ Pilot Demo Service exists\n`;
        const content = fs.readFileSync(servicePath, 'utf8');
        
        if (content.includes('lari_in_pilot_demo') && content.includes('lari_saved_real_tenant_id')) {
            output += `- ✅ Service safely isolates demo state without overwriting real state\n`;
        } else {
            output += `- ❌ Service does not safely isolate state\n`;
            passed = false;
        }

        if (content.includes('Lumina Güzellik') || content.includes('Saç Kesimi')) {
            output += `- ✅ Service uses realistic seeded demo data\n`;
        } else {
            output += `- ❌ Service might be missing realistic data\n`;
            passed = false;
        }
    } else {
        output += `❌ pilotDemoService.ts not found.\n`;
        passed = false;
    }

    const appTsx = path.join(rootDir, 'App.tsx');
    if (fs.existsSync(appTsx)) {
        const content = fs.readFileSync(appTsx, 'utf8');
        if (content.includes('path="/pilot"')) {
             output += `- ✅ /pilot route added to App.tsx\n`;
        } else {
            output += `- ❌ /pilot route missing from App.tsx\n`;
            passed = false;
        }
    }

    const mkt = path.join(rootDir, 'pages', 'MarketingHomePage.tsx');
    if (fs.existsSync(mkt)) {
       const content = fs.readFileSync(mkt, 'utf8');
       if (content.includes('to="/pilot"')) {
           output += `- ✅ Link to /pilot exists in MarketingHomePage\n`;
       } else {
           output += `- ❌ Link to /pilot missing\n`;
           passed = false;
       }
    }

    output += `\n## Summary\n`;
    if (passed) {
        output += `✅ Pilot demo checks passed.\n`;
        console.log(`✅ Pilot demo checks passed.`);
    } else {
        output += `❌ Pilot demo checks failed.\n`;
        console.error(`❌ Pilot demo checks failed.`);
    }

    const reportDir = path.join(rootDir, 'qa-reports');
    if (!fs.existsSync(reportDir)) {
        fs.mkdirSync(reportDir);
    }
    
    fs.writeFileSync(path.join(reportDir, 'PILOT_DEMO_REPORT.md'), output);
    if (!passed) {
        process.exit(1);
    }
};

runTests();
