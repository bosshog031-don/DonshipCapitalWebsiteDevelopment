# IMPLEMENTATION PLAN — Premium Elevation Upgrade (v2)

## Overview
Elevate Donship Capital from world-class to premium-tier through strategic content, CTA optimization, new sections, and design polish.

## Checklist

### Phase 1 — Highest Impact (Homepage)
- [ ] 1.1 Add "Results" / Client Outcomes section (3 outcome stories between Packages and CTA band)
- [ ] 1.2 Diversify all CTAs per the strategic framework (unique per section)
- [ ] 1.3 Add micro-copy under primary CTAs (objection-killing subtext)
- [ ] 1.4 Add "How It Works" process timeline section to homepage
- [ ] 1.5 Sharpen hero value proposition copy
- [ ] 1.6 Sharpen Five Pillars descriptions (transformation-based)

### Phase 2 — Brand Depth (Homepage)
- [ ] 2.1 Add Founder / About section to homepage
- [ ] 2.2 Add FAQ section to homepage
- [ ] 2.3 Add "Why Donship" comparison table (vs. consultants, agencies, DIY)
- [ ] 2.4 Elevate package card design — differentiate Growth card, exclusive Scale CTA

### Phase 3 — CTA Band & Footer Updates
- [ ] 3.1 Rewrite CTA band with specific, strategic copy
- [ ] 3.2 Add capacity-based urgency element
- [ ] 3.3 Update footer copyright to 2025

### Phase 4 — CSS: New Section Styles
- [ ] 4.1 Add CSS for Results/Outcomes section
- [ ] 4.2 Add CSS for How It Works process timeline
- [ ] 4.3 Add CSS for Founder section
- [ ] 4.4 Add CSS for FAQ accordion
- [ ] 4.5 Add CSS for Comparison table
- [ ] 4.6 Add CSS for micro-copy under CTAs
- [ ] 4.7 Package card tilt effect for pkg-cards (currently only on product-cards)
- [ ] 4.8 Responsive styles for all new sections

### Phase 5 — JavaScript
- [ ] 5.1 FAQ accordion toggle functionality
- [ ] 5.2 Add pkg-cards to the tilt effect
- [ ] 5.3 Add new section element classes to stagger animation observer

### Phase 6 — Services & Book Pages
- [ ] 6.1 Update services.html CTAs to match new framework
- [ ] 6.2 Update book.html value proposition copy

## Backup Files
All original files backed up as `.bak`:
- `index.html.bak`
- `style.css.bak`
- `main.js.bak`
- `book.html.bak`
- `services.html.bak`

## Revert Command
```powershell
# To revert ALL changes:
Get-ChildItem *.bak | ForEach-Object { Copy-Item $_.FullName ($_.FullName -replace '\.bak$','') -Force }; Remove-Item *.bak
```
