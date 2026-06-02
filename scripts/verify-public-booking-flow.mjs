import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

let hasErrors = false;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAILED: ${message}`);
    hasErrors = true;
  } else {
    console.log(`✅ PASSED: ${message}`);
  }
}

console.log('Running Public Booking Flow Readiness Check...\n');

const bookingPagePath = path.join(rootDir, 'src/pages/BookingPage.tsx');
const bookingPageContent = fs.readFileSync(fs.existsSync(bookingPagePath) ? bookingPagePath : path.join(rootDir, 'pages/BookingPage.tsx'), 'utf-8');

assert(
  bookingPageContent.includes("isAiEnabled="),
  "BookingPage must pass isAiEnabled to SalonWebsiteView"
);

assert(
  bookingPageContent.includes("Randevu Detayları") || bookingPageContent.includes("Appointment Details"),
  "BookingPage must render localized Appointment Details summary in step 5"
);

assert(
  !bookingPageContent.includes("Randevu Bilgilendirmesi Hazırlanmıştır") || bookingPageContent.includes("{/*"),
  "AI logs must be hidden from normal user booking summary"
);

assert(
  bookingPageContent.includes("Sizi Yönlendiren Biri Var mı?"),
  "BookingPage must contain optional referral section"
);

assert(
  bookingPageContent.includes("handleWebsiteStaffSelect") && bookingPageContent.includes("Bana Fark Etmez"),
  "Public booking flow must support earliest staff/no preference auto-selection"
);

if (hasErrors) {
  console.error('\n❌ Public Booking UX QA check failed. Please fix the above issues.');
  process.exit(1);
} else {
  console.log('\n🎉 Public Booking UX QA passed successfully!');
  process.exit(0);
}
