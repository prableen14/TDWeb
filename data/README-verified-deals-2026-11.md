# Verified deals batch — November 15, 2026

Seven deal records ready for Sanity **draft** import.

Run:
```bash
node scripts/import-finds.mjs data/verified-deals-2026-11.json
```

All offers have source URLs in each record. Verify the live offer page before publishing; prices and promotions can change.

**Editorial notes:**
- No `brand` or `locations` references are set, because this batch is chain-wide or online and we must not invent venue links. These deals **will not appear on Near Me** until real participating venue references with coordinates are attached. Add Brand references in Sanity to enable shared image fallback.
- Harvey's $3 app offer and CAA discount have **no confirmed end date**, so endDate is deliberately omitted. Periodically recheck and archive when discontinued.
- Harvey's gift card promotion has a **January 2027 redemption window**, distinct from the purchase date; the purchase deadline was not verified, so no date range is fabricated.
- Denny's endDate is the gift-card purchase deadline, **not** the redemption deadline.
- Walmart and Best Buy dates describe **sale windows**, not specific product discounts. Individual items are not promised.
- Canadian Tire dates reflect a **particular weekly flyer**, and its source is a general flyer landing page.
- Do not mark any gift-card bonus as an unconditional freebie.
- The import script skips existing slugs and creates drafts; review them in Sanity before publishing.
