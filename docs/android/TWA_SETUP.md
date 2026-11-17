# Android Trusted Web Activity release checklist

**Status (2026-11-17):** the PWA manifest, icons, service worker, and production-only service-worker registration are present. A trilingual privacy-policy page is at `/privacy` (`/ar/privacy`, `/ms/privacy`). The owner confirmed both direct APK distribution and Google Play, the current Vercel origin, and the package ID below. The Digital Asset Links URL is wired up but deliberately stays unconfigured until real signing-certificate fingerprints are available.

## Confirmed Android app identity

| Setting | Confirmed value |
| --- | --- |
| Website origin | `https://aboalazm-os.vercel.app` |
| Android application ID | `com.aboalazm.os` |
| Manifest | `https://aboalazm-os.vercel.app/manifest.webmanifest` |
| Play privacy-policy URL | `https://aboalazm-os.vercel.app/privacy` |
| Target SDK for a new Play submission | Android 16 / API 36 or higher |

Keep this origin and package ID stable for the first release. Changing the domain after building requires rebuilding the TWA and updating Digital Asset Links; changing the package ID after publication creates a different Android app.

## 1. Create the Android package and signing key

Run Bubblewrap from a machine that has a supported Java JDK and Android SDK installed. Keep the signing keystore and its passwords in your own secure storage; do not commit them, upload them to a shared project folder, or send passwords in chat.

```sh
npx @bubblewrap/cli init --manifest=https://aboalazm-os.vercel.app/manifest.webmanifest
npx @bubblewrap/cli build
```

During `init`, use the confirmed package ID `com.aboalazm.os`, the confirmed Vercel origin, a new signing key you control, and **target SDK 36 or higher**. Keep a backup of the keystore and recovery details. The build produces an Android App Bundle (`.aab`) for Play and a signed APK for direct installation/distribution.

### Direct APK and Google Play are separate delivery paths

- Share the signed `.apk` only with people you intend to test or distribute to directly. Android may show a Play Protect / unknown-source warning because it was installed outside Google Play.
- Upload the `.aab` to Play Console; Play generates the store-delivered APKs and signs them with the Play App Signing key.
- Keep both the local/upload certificate and Play App Signing certificate in Digital Asset Links. If those certificates differ, a Play-installed build may not update over a sideloaded APK; the tester may need to uninstall the direct APK first.

To read the local signing-certificate SHA-256 fingerprint, use `keytool` against the keystore Bubblewrap created (the alias and path are the ones shown by Bubblewrap):

```sh
keytool -list -v -keystore /path/to/your-upload-key.keystore -alias YOUR_KEY_ALIAS
```

Copy the `SHA256` certificate fingerprint only. A certificate fingerprint is public; the keystore and password are not.

## 2. Configure Digital Asset Links

The app's URL-bar-free TWA verification is served from the exact root path:

```text
https://aboalazm-os.vercel.app/.well-known/assetlinks.json
```

The Next.js rewrite serves this as JSON from `/api/android/assetlinks`. Until `ANDROID_SHA256_CERT_FINGERPRINTS` contains at least one valid fingerprint, the route returns HTTP 503 instead of publishing a fake or placeholder statement.

After the first signed build, set the Bubblewrap upload/local certificate fingerprint in Vercel's **Production** environment variable:

```text
ANDROID_SHA256_CERT_FINGERPRINTS=AA:BB:...:01
```

After enabling Play App Signing and uploading the first bundle, copy the **App signing key certificate** SHA-256 fingerprint from Play Console and add it as another comma-separated entry. Keep the upload/local fingerprint too so sideloaded test APKs can be verified:

```text
ANDROID_SHA256_CERT_FINGERPRINTS=UPLOAD_CERT_SHA256,PLAY_APP_SIGNING_CERT_SHA256
```

Redeploy after changing the Vercel environment. Then check that the URL returns HTTP 200, `Content-Type: application/json`, no redirect, and a JSON array with the expected package ID and fingerprints. The package ID in the statement is currently fixed in `lib/android-assetlinks.ts` as `com.aboalazm.os`.

## 3. Test before uploading

1. Install the APK on a real Android device. A visible browser bar means origin verification failed: check the final host, package ID, the signing certificate on that APK, and the deployed JSON response.
2. Exercise the website from the app, including its contact form, resource downloads, back navigation, and offline fallback. The app is a web experience, so testers should actually use the content rather than only install and open it once.
3. Confirm the privacy page loads in the app and that the Play listing points to the same public URL.

## 4. Play Console submission

Google Play's published target-API requirement says new apps and updates submitted from **31 August 2026** must target **Android 16 / API 36 or higher**. This is a newly created personal developer account, so the current requirement is a closed test with at least **12 opted-in testers continuously for 14 days** before applying for production access. The 14-day clock starts when the closed track is available and the testers opt in—not when the developer account is created. Google can ask for further testing if tester engagement is insufficient; the test does not guarantee approval. Daily app opens are sensible test guidance, but the published minimum is continuous opt-in for the 14-day period.

Complete the Play listing, content rating, Data safety form, app-access instructions if any, screenshots, and privacy-policy link. Answer the Data safety questionnaire from the app's actual data handling: the site accepts contact details and resource-request emails and sends limited usage analytics, as described in the published policy. Do not submit a Data safety declaration solely from this checklist; verify it against the final release build and enabled Vercel providers.

Official references:

- [Google Play target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
- [Google Play testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- [Chrome documentation: Digital Asset Links for Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/android-for-web-devs)

## What still needs the owner

- Create and safely back up the signing key on an owner-controlled machine.
- Provide the public SHA-256 certificate fingerprints as Vercel environment configuration (not the keystore/password).
- Own the Play Console account, store listing, Data safety answers, tester recruitment, release submission, and Google review.

This workspace has no Java JDK or Android SDK installed, so it can prepare and validate the web-side integration but cannot produce a signed APK/AAB here. Google Play acceptance and review time are controlled by Google and cannot be guaranteed.
