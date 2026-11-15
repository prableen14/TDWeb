# Verified Toronto Finds batch — November/December 2026

This is a **staged import**, not a live database write. Sources were checked November 14, 2026. Event information can change.

## Run locally (requires your existing private Sanity write token in .env.local)

```bash
node scripts/import-venues.mjs data/upcoming-venues-2026-11.json
node scripts/import-finds.mjs data/upcoming-finds-2026-11.json
```

The importers create **drafts**, skip existing matching slugs, and do not publish automatically. If a venue slug already exists in Sanity, the importer reuses it. Ensure these existing venues are present: `distillery-historic-district`, `nathan-phillips-square`, `stackt-market`. If they are missing, first run `node scripts/import-venues.mjs` to import the original venues.

After import, review and publish new venues first, then publish Finds in Sanity Studio. For Near Me, use the **Find coordinates** button in each Venue to populate its geopoint.

## Editorial review needed

- **Holiday EcoMarket** runs **Nov 20–22 and Dec 18–20**, NOT continuously between those dates. The single date range is only a coarse placeholder. Split it into two separate dated Finds before publishing to prevent incorrect Today/Weekend results.
- **HarbourFrost**, **Distillery Winter Village**, **Holiday Hills** and **Cavalcade of Lights** run across multiple dates with variable daily hours; their range represents the overall season, not continuous opening. Confirm individual hours in official programmes.
- Some events are free admission but have paid add-ons. Do not imply all activities or products are free.
- No image assets are imported. Add official/licensed images manually in Sanity.
- Existing drafts with the same slug are **skipped** rather than overwritten. Review them in Sanity.
- For any entry without a verified exact time, midnight dates are placeholders for day-level dates, **not opening times**. Correct these before publication.
- Source URLs are included in each Find. Some are official organizer pages; others are tourism organization listings.
- Public Nominatim is not for bulk geocoding; geocode venues individually or use a provider with suitable usage terms.
