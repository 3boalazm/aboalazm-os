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

## 1. Build the Android packages and signing key

Install Node.js 18 or later and npm, then run Bubblewrap in the Android project directory. **You do not have to preinstall a JDK or Android SDK:** on first use, Bubblewrap offers to download and install the required external dependencies. Accept that setup (including any SDK licence prompts), or follow Bubblewrap's manual setup guide if you prefer an existing toolchain. Keep the signing keystore and its passwords in your own secure storage; do not commit them, upload them to a shared project folder, or send passwords in chat.

```sh
npx @bubblewrap/cli init --manifest=https://aboalazm-os.vercel.app/manifest.webmanifest
npx @bubblewrap/cli build
```

During `init`, use the confirmed package ID `com.aboalazm.os`, the confirmed Vercel origin, and a new signing key you control. Before building a Play release, inspect the generated `app/build.gradle` and verify `targetSdkVersion` is **36 or higher**; do not assume an older generated project has the current Play target. Keep a secure backup of the keystore and recovery details. Bubblewrap's build produces both `app-release-signed.apk` (for direct installation/testing) and `app-release-bundle.aab` (for Play Console).

### Direct APK and Google Play are separate delivery paths

- Share the signed `.apk` only with people you intend to test or distribute to directly. Android may show a Play Protect / unknown-source warning because it was installed outside Google Play.
- Upload the `.aab` to Play Console; Play generates the store-delivered APKs and signs them with the Play App Signing key.
- Keep both the local/upload certificate and Play App Signing certificate in Digital Asset Links. If those certificates differ, a Play-installed build may not update over a sideloaded APK; the tester may need to uninstall the direct APK first.

After `init` creates your signing key and `build` signs the packages, read its SHA-256 certificate fingerprint with `keytool` (included with Bubblewrap's configured JDK; if your shell cannot find it, run the `keytool` executable from that JDK). Use the keystore path and alias shown by Bubblewrap:

```sh
keytool -list -v -keystore /path/to/your-upload-key.keystore -alias YOUR_KEY_ALIAS
```

Copy the `SHA256` certificate fingerprint only. A certificate fingerprint is public; the keystore and password are not.

## 2. Configure Digital Asset Links in this order

Do not test the Android build until the production asset-links URL has been redeployed and verified. The sequence is **build → obtain fingerprint → configure Vercel Production → redeploy → verify HTTP 200 → test on a real phone**.

The app's URL-bar-free TWA verification is served from the exact root path:

```text
https://aboalazm-os.vercel.app/.well-known/assetlinks.json
```

The Next.js rewrite serves this as JSON from `/api/android/assetlinks`. Until `ANDROID_SHA256_CERT_FINGERPRINTS` contains at least one valid fingerprint, the route returns HTTP 503 instead of publishing a fake or placeholder statement.

1. **Build first.** Complete the signed APK/AAB build in §1.
2. **Obtain the certificate fingerprint.** Read the upload/local signing-key SHA-256 fingerprint from the keystore created by Bubblewrap using the `keytool` command above. The fingerprint is public certificate data; never share the keystore or passwords.
3. **Configure Vercel Production.** Set `ANDROID_SHA256_CERT_FINGERPRINTS` in the Vercel project's **Production** environment to the exact colon-delimited SHA-256 value printed by `keytool` (no quotes or placeholder text).

4. **Redeploy Production** so the environment change reaches the live app.
5. **Verify the deployed endpoint** before device testing. It must return HTTP 200, `Content-Type: application/json`, no redirect, and a JSON array containing package ID `com.aboalazm.os` and the expected upload/local fingerprint. Until this is true, TWA verification is not ready.

After the first Play AAB upload, copy the **App signing key certificate** SHA-256 fingerprint from Play Console and add it beside the upload/local fingerprint as a comma-separated list of the two real, colon-delimited values. Redeploy Production again and repeat the HTTP 200/JSON verification before testing the Play-installed build. Keep the upload/local fingerprint in the list so direct APK installations can also be verified.

The package ID in the Digital Asset Links statement is fixed in `lib/android-assetlinks.ts` as `com.aboalazm.os`.

## 3. Test on a real Android phone

Only after the §2 asset-links check passes, install the signed APK on a real Android phone. A visible browser bar means origin verification failed: check the exact host, package ID, certificate fingerprint on that APK, and the currently deployed JSON response.

Exercise the website from the app, including contact enquiries, resource downloads, back navigation, language changes, and the offline/unavailable-page fallback. Confirm the privacy page loads and the app returns to the expected Vercel origin. Test a Play-installed build again after adding the Play App Signing fingerprint. Testers should actually use the content during a closed test rather than only install and open the app once.

## 4. Play Console submission

Google Play's published target-API requirement says new apps and updates submitted from **31 August 2026** must target **Android 16 / API 36 or higher**. This is a newly created personal developer account, so the current requirement is a closed test with at least **12 opted-in testers continuously for 14 days** before applying for production access. The 14-day clock starts when the closed track is available and the testers opt in—not when the developer account is created. Google can ask for further testing if tester engagement is insufficient; the test does not guarantee approval. Daily app opens are sensible test guidance, but the published minimum is continuous opt-in for the 14-day period.

Complete the Play listing, content-rating questionnaire, Data safety form, app-access instructions if any, phone screenshots, and the **1024 × 500 px feature graphic**. The draft listing copy and a provisional Data safety review worksheet are in [`PLAY_STORE_DRAFT.md`](./PLAY_STORE_DRAFT.md); they are **not ready to submit**. Verify every disclosure against the final TWA/web build, its third-party code, actual Vercel Production configuration, configured database and SMTP/email providers, and Google Play's current form before entering answers. The public site accepts contact details and resource-request emails and emits usage analytics, but that summary is not a substitute for the release audit. Review the privacy policy with the owner and confirm the published URL before submission.

Official references:

- [Chrome TWA quick start: Bubblewrap first-run dependency downloads](https://developer.chrome.com/docs/android/trusted-web-activity/quick-start)
- [Bubblewrap CLI documentation](https://github.com/GoogleChromeLabs/bubblewrap/blob/main/packages/cli/README.md)
- [Google Play target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878)
- [Google Play testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465)
- [Google Play Data safety form requirements](https://support.google.com/googleplay/android-developer/answer/10787469)
- [Chrome documentation: Digital Asset Links for Trusted Web Activities](https://developer.chrome.com/docs/android/trusted-web-activity/android-for-web-devs)

## What still needs the owner

- Create and safely back up the signing key on an owner-controlled machine.
- Provide the public SHA-256 certificate fingerprints as Vercel Production configuration (not the keystore/password), then redeploy and verify the endpoint before phone testing.
- Review the privacy policy and draft Data safety/listing worksheet against the final code, third-party code, and live provider configuration.
- Create the store screenshots and 1024 × 500 px feature graphic; complete the content rating and listing.
- Own the Play Console account, tester recruitment, closed-test participation, release submission, and Google review.

No Android package build, signed APK/AAB, Vercel Production update, or physical-device test has been performed for this checklist. This workspace does not have a preinstalled JDK or Android SDK; Bubblewrap offers first-run dependency downloads, but no build was attempted here. Google Play acceptance and review time are controlled by Google and cannot be guaranteed.
