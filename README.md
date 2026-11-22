# 📱 NFC Smart Review Card System ("Copy & Redirect" Flow)

A lightweight, mobile-first, responsive web application engineered specifically for **NFC Tap-to-Review** cards, stands, and stickers. When customers tap their iPhone or Android smartphone on the card, this web app opens immediately, loads a human-sounding unique review suggestion, lets them customize it with quick-tap pills, and copies the review to clipboard while smoothly redirecting them to Google Reviews.

---

## 🚀 Key Features

1. **Dynamic Multi-Client Support via URL Parameters:**
   - Single hosted deployment can serve **unlimited different clients and businesses**.
   - Accepts URL parameters:
     - `?placeid=` (Google Place ID, default: `ChIJ67svB4SDXjkR9yp6UifRj84`)
     - `?name=` (Business Name, default: `Our Business`)
     - `?category=` (`clinic`, `cafe`, `salon`, `retail`, `general`, default: `general`)
     - `?keywords=` (Optional comma-separated real-world keywords, e.g. `Dr.+Sharma,short+wait,spotless+clinic`)
   - Constructs redirect target automatically:
     ```
     https://search.google.com/local/writereview?placeid=${placeid}
     ```

2. **Google Anti-Gating Compliant (100% Policy-Safe):**
   - Strictly avoids "review gating": tapping 1, 2, 3, 4, or 5 stars **never** blocks the customer from proceeding to Google.
   - For 1–3 stars, the combinatorial engine adaptively generates balanced, constructive feedback so the user can voice honest observations directly on Google without risking Google review profile penalties.

3. **Anti-Spam Combinatorial Engine with Entity Grounding:**
   - Generates unique, authentic reviews on initial load using modular sentence structure (`Openers` × `Business Name Anchors` × `Category Highlights` × `Real Keywords` × `Closings`).
   - Category-specific vocabulary tailored to clinics, cafes, salons, retail shops, and professional services.
   - Built-in hash memory prevents repeating recent combinations on sequential taps.
   - **"↻ New Idea"** button instantly shuffles a fresh combination.

4. **Mobile Pop-Up Blocker Proof (Same-Tab Navigation):**
   - Utilizes `window.location.href = targetUrl` (same-tab navigation) to eliminate iOS Safari and Android Chrome pop-up blocker issues that plague delayed `window.open()` calls.
   - Includes direct fallback button inside the copied toast overlay for instant manual override.

5. **Editable Review Box & Quick-Tap Keyword Chips:**
   - Pre-populated `<textarea>` allows full user customization.
   - 5 category-tailored keyword chips + dynamic custom keyword chips from URL parameters that toggle in and out naturally without duplication.
   - Live character count, word count, and optimal length indicator.

6. **Built-in NFC Tag Link Configurator:**
   - Tap the gear icon in the top header to preview presets or generate custom NFC URLs with keywords to encode directly into your cards.

---

## 🛠️ How to Program Physical NFC Cards (NTAG213 / NTAG215 / NTAG216)

1. Download **NFC Tools** (Free on iOS App Store and Google Play).
2. Open NFC Tools and tap **Write** > **Add a record** > **URL / URI**.
3. Enter your hosted URL with query parameters:
   ```text
   https://your-domain.com/?placeid=ChIJ67svB4SDXjkR9yp6UifRj84&name=Dr.+Sharma+Clinic&category=clinic&keywords=Dr.+Sharma,short+wait,spotless+rooms
   ```
4. Tap **Write** and tap the physical card against the top of your phone.
5. That's it! Any phone that taps the card will launch this instant review flow.

---

## 📂 Project Structure

- `index.html`: Responsive, mobile-first single-page application.
- `style.css`: Modern styling optimized for iOS Safari (notch safe-area, no auto-zoom) and Android.
- `reviews-engine.js`: Combinatorial anti-spam review engine with entity grounding and rating adaptation.
- `app.js`: Application controller, clipboard handler, confetti, and URL parameter logic.
