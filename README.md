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
   - Constructs redirect target automatically:
     ```
     https://search.google.com/local/writereview?placeid=${placeid}
     ```

2. **Anti-Spam Combinatorial Review Engine:**
   - Generates unique, authentic reviews on initial load using a modular sentence structure (`Openers` × `Category Highlights` × `Secondary Connectors` × `Closings`).
   - Category-specific vocabulary tailored to clinics, cafes, salons, retail shops, and professional services.
   - Built-in hash memory prevents repeating recent combinations on sequential taps.
   - **"↻ New Idea"** button instantly shuffles a fresh combination.

3. **Editable Review Box & Quick-Tap Keyword Chips:**
   - Pre-populated `<textarea>` allows full user customization.
   - 5 category-tailored keyword chips (e.g. `+ Polite staff`, `+ Quick service`, `+ Clean & hygienic`) that toggle in and out of the review naturally without duplications.
   - Live character count, word count, and optimal length indicator.
   - 5-Star interactive rating selector with feedback sentiments.

4. **Seamless "Copy & Redirect" Flow:**
   - Prominent, thumb-friendly **"Copy & Open Google Review"** button with Google branding and pulse shine.
   - Modern `navigator.clipboard` with an automatic hidden `document.execCommand('copy')` fallback for 100% compatibility across iOS Safari, Android Chrome, and in-app WebViews.
   - Haptic vibration feedback (`navigator.vibrate`).
   - Visual celebration confetti burst.
   - Polished backdrop toast modal confirming copy and auto-redirecting to Google.

5. **Built-in NFC Tag Link Configurator:**
   - Tap the gear icon in the top header to preview presets or generate custom NFC URLs to encode directly into your cards.

---

## 🛠️ How to Program Physical NFC Cards (NTAG213 / NTAG215 / NTAG216)

1. Download **NFC Tools** (Free on iOS App Store and Google Play).
2. Open NFC Tools and tap **Write** > **Add a record** > **URL / URI**.
3. Enter your hosted URL with query parameters:
   ```text
   https://your-domain.com/?placeid=ChIJ...&name=Apex%20Dental&category=clinic
   ```
4. Tap **Write** and tap the physical card against the top of your phone.
5. That's it! Any phone that taps the card will now launch this instant review flow.

---

## 📂 Project Structure

- `index.html`: Responsive, mobile-first single-page application.
- `style.css`: Modern styling optimized for iOS Safari (notch safe-area, no auto-zoom) and Android.
- `reviews-engine.js`: Combinatorial anti-spam review engine and category dictionaries.
- `app.js`: Application controller, clipboard handler, confetti, and URL parameter logic.
