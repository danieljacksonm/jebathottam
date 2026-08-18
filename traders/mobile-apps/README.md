# Mobile apps (WebView)

Two **separate** Android apps. Each only opens its own website.

| App | Folder | Package | Opens |
|-----|--------|---------|--------|
| **Yegova Fusion** | `fusion/` | `store.yegova.fusion` | Fusion Corner site |
| **Yegova Traders** | `traders/` | `store.yegova.traders` | Traders GST site |

## Before you build

1. Set each site URL:
   - Fusion: `fusion/app/src/main/res/values/strings.xml` → `site_url`  
     (default: `http://cococola.yegova.store/`)
   - Traders: `traders/app/src/main/res/values/strings.xml` → `site_url`  
     (**must** put your real Traders URL)
2. Prefer **https://**. `http://` also works (cleartext allowed).

## How to build APK (Android Studio)

1. Install [Android Studio](https://developer.android.com/studio)
2. **File → Open** → select `mobile-apps/fusion` **or** `mobile-apps/traders` (one at a time)
3. Wait for Gradle sync
4. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
5. Install APK on phone

You will get **two icons** on the phone: Fusion and Traders.

## What the app does

- Opens only that site in full screen WebView
- JavaScript / login / billing work like Chrome
- Back button = previous page
- Pull down = refresh
- Not a full native billing app — your PHP site does the work

## Website download page

After you build the APK:

1. Copy APK to the site:
   - Fusion → `fusion/downloads/yegova-fusion.apk`
   - Traders → `downloads/yegova-traders.apk`
2. Open on phone:
   - Fusion: `https://your-fusion-site/download_app.php`
   - Traders: `https://your-traders-site/download_app.php`
3. Login page and dashboard also have **📱 Download Android App** / **📱 App** button

This PC may not have Android SDK — build APK on a computer with Android Studio.
