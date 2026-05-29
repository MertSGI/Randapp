# Micro Fix Queue

| ID | Area | Route/Component | Issue | Severity | Status | Expected Behavior |
|---|---|---|---|---|---|---|
| MF-01 | CRUD | AdminPage.tsx | UI delete handlers need full proof validation with dev tool | P0 | fixed | `useDialog` integrated, avoiding iframe block |
| MF-02 | UI/UX | /book | Inactive services/staff still visible | P1 | fixed | `activeOnly: true` confirmed working |
| MF-03 | Content | Public | Mixed TR/EN in public pages | P2 | fixed | Component correctly varies syntax by language |
| MF-04 | Admin | CustomerMemoryTab.tsx | Deletion of notes/photos doesn't work locally | P2 | fixed | Confirmed state object reference swap resolves view |
| MF-05 | System | Supabase | Storage/Edge functions missing ID checks | P1 | open | Edge functions properly validate JWT and tenant boundaries |
