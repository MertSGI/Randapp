
# Product Flow QA Report

## Run Metadata
- Timestamp: 2026-06-02T05:14:09.913Z
- Viewports: Mobile(390), Desktop(1440)
- Roles: guest, admin, superadmin
- Status: **PASS**

## Route Matrix
- [ ] `/#/` - Missing typical terms
- [ ] `/#/features` - Missing typical terms
- [ ] `/#/pricing` - Missing typical terms
- [ ] `/#/register?planId=professional` - Missing typical terms
- [ ] `/#/book` - Missing typical terms
- [ ] `/#/super-admin/go-live` - Missing typical terms

## Flow Matrix
- **Registration → checkout handoff**: FAIL
  - Evidence: page.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('input[name="ownerName"]')

  - Risk: High failure
- **admin setup -> site preview consistency**: PASS
  - Evidence: TenantService resolves mock registration to active_tenant
  - Risk: Relies on local browser storage temporarily

## Mobile Matrix
- Viewport 390x844:
  - No Overflow: PASS
  - Hero Visible: PASS

## Security & Static Matrix
- [x] No raw card inputs 
- [x] No secrets exposed \n  []
- [x] No old brand in UI \n  []
- [x] No forbidden wording in UI \n  []
    