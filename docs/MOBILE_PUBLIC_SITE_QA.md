# Mobile Public Site QA Checklist

## Layout & Viewport
- [x] Content is constrained to `max-w-lg mx-auto` to prevent weird ultra-wide stretching on desktop while keeping a tight phone-like canvas frame.
- [x] No horizontal scrolling/overflow on mobile devices (320px - 430px widths tested).
- [x] Margins and paddings are generous but proportional to a mobile layout (e.g., `px-4`, `p-6`).

## Hero Section & Cover
- [x] Cover image height is reasonable (`h-56`) to allow immediate visibility of brand details.
- [x] Multiple cover images use horizontal paging/carousel dots and arrows, and support tap-to-lightbox.
- [x] Logo prominently overlaps the hero section (`-mt-12`), using rounding and border for contrast.
- [x] Clear and readable Typography for Business Name and short description under the logo.

## Booking Flow Split
- [x] Public site behaves identically to a standalone marketing web business card until the user initiates a booking. 
- [x] Booking stepping indicator (1-2-3-4-5) is completely hidden during the website view (Step 0).
- [x] Sticky or prominent "Randevu Al" floating/bottom CTAs scroll smoothly to the booking section.
- [x] "En Yakın Müsait" / "Fark Etmez" quick actions added directly to the website Uzmanlar list.

## Tap Targets & Accessibility
- [x] All buttons (Instagram, Map, WhatsApp, Phone, Booking) maintain a minimum of 44x44px touch area (Tailwind `h-12 w-12` minimums used for icon buttons).
- [x] Contrast ratios between text and background on `bg-white` / `bg-slate-800` cards is high.

## Media Upload
- [x] Gallery uses a native horizontal scrolling overflow array (`snap-x`, `overflow-x-auto`) for mobile thumb-swiping. 
- [x] Tap an image in Gallery -> Opens full screen Lightbox overlay with fixed close button.
- [x] Profile Edit now supports mult-file native upload component from device. URL is fallback/optional.

## Previews vs Production
- [x] Real preview `SitePreviewPage` looks indistinguishable from the production routing `/book` (minus the admin preview wrapper).
- [x] Identical stylistic patterns to demo are enforced directly via Tailwind.
