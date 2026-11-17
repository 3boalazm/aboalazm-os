# Google Play Data safety and store listing — draft only

> **Not ready for Play Console submission.** This is a working draft based on repository code reviewed on 17 November 2026, not a production traffic capture or a review of the final signed release. The app is a Trusted Web Activity (TWA), not a native Android WebView. Google Play's Data safety guidance explicitly discusses developer-controlled WebView content and third-party libraries; apply the current policy to the final TWA delivery and the website code it opens rather than reviewing only the small native wrapper. Re-check every item against the final APK/AAB, current website JavaScript, live Vercel Production settings, and the actual database, analytics, and email providers before submitting.

## What the repository currently shows

- The public site and TWA do not require user registration or provide a user account system.
- The contact form requires a name, email address, and project brief; company, timeline, budget band, service/package context, and campaign context are optional. The contact record is stored in the `messages` collection. If SMTP is configured, contact details and the brief are also sent to the configured inbox through the configured email provider.
- Resource requests ask for an email address and may include the selected resource and a broad request intent. The record is stored in `resource-leads`. The resource endpoint does not send a resource-request email in the code reviewed.
- The browser sends page views and allowlisted interaction events to the first-party `/api/track` collector, which stores sanitized paths, event names, limited context, a coarse device class, and a random tab-session identifier in the `analytics-events` collection. The app also includes `@vercel/analytics`; the current layout mounts its Analytics component and the client event helper sends a copy of conversion events to that SDK.
- The server reads the forwarded IP for short-lived in-memory rate limiting. The analytics route receives the user-agent header and reduces it to a coarse device class; raw IP addresses and full user-agent strings are not written to the first-party analytics collection. Hosting, network, analytics, and other providers may process technical request data under their own logging and retention practices.
- The public privacy policy currently names Vercel (hosting and Analytics), a managed PostgreSQL provider (currently Neon), Vercel Blob for site media, and the SMTP/email provider configured for enquiry notifications. `DATABASE_URI` and SMTP configuration are environment-dependent; this document does not confirm the current Production values or provider contracts.
- The policy says there is no automatic deletion period for enquiry, resource-request, or analytics records. It describes manual privacy requests through the contact details on the policy page. Confirm that the address is monitored and that an operational deletion process exists.

## Provisional Data safety worksheet

These are **candidate disclosures to investigate**, not final checkbox selections. The Play form's data categories and purposes must be checked against its current wording when completing the console.

| Candidate Play data type | Evidence in the current app | Draft handling / question to resolve |
| --- | --- | --- |
| **Personal info — Name** | Required by the contact form and stored with the enquiry. | Candidate: collected when an enquiry is submitted; used to respond. Not required to browse the app. Confirm how the Play form defines optional collection for this feature. |
| **Personal info — Email address** | Required by the contact form and resource gate; stored in `messages` or `resource-leads`. Contact data may also be sent through SMTP when configured. | Candidate: collected when a user submits either form; used to respond or provide the requested resource. Not required for general browsing. Verify all current storage and email destinations. |
| **Personal info — Other info / user-generated content** | Optional company, project brief, timeline, selected service/package, budget band, resource choice, and request intent are handled by forms. Free-text fields can contain information the app did not specifically request. | Determine the correct Play category or categories for the project brief and other submitted fields. Do not assume free text is non-personal; inspect the final form copy and the exact fields saved or emailed. |
| **Financial info — possible “other financial info”** | The enquiry form offers optional project-budget bands. No payment-card or bank-account field is present in the contact/resource forms reviewed. | Ask whether the project budget field falls under a Play financial-data type. External payment links or instructions are not the same as collecting payment credentials, but review the final app and link behavior. |
| **App activity — app interactions** | First-party and Vercel Analytics receive page views and selected button, form, and content events. First-party paths omit query strings; event properties are allowlisted/sanitized. | Candidate: collected for analytics. Confirm the Vercel SDK's current payload, identifiers, retention, and any automatic collection. No site-wide analytics opt-out was found in the repository review. |
| **Device or other IDs — possible tab-session identifier** | A random identifier is kept in `sessionStorage` for the browser-tab session and sent to `/api/track`; the first-party collector stores it. | Ask whether Play classifies this short-lived session identifier as a device or other ID. Separately audit any identifiers used by Vercel Analytics; the repository review does not establish the SDK's full behavior. |
| **IP address / request headers — infrastructure review** | Requests reach the host with technical headers. The app uses the forwarded IP in in-memory rate-limit buckets; the user-agent is used for bot checks and reduced to a coarse device class for analytics. | Check Google Play's current category guidance and Vercel/provider logs and retention. Do not treat “not stored in our analytics table” as proof that no data is collected by the app or its processors. |

### Sharing, purpose, security, and deletion questions

- **Collection:** A provisional “yes” is likely because the controlled web experience sends contact/resource data and analytics events off-device. Confirm the final build and every configured data path.
- **Sharing:** Google Play excludes transfers to a qualifying service provider acting on the developer's behalf from its definition of “sharing.” Verify whether Vercel, the database provider, the SMTP/email provider, and the Analytics SDK meet that definition under the actual contracts and settings. If any recipient uses data for its own purposes, assess and disclose it accordingly. Review user-initiated links to WhatsApp, booking, social, and payment services separately.
- **Purposes:** Likely purposes to validate are responding to enquiries, delivering requested resources, app/site functionality, analytics, and abuse prevention/security. Do not select advertising or marketing purposes based only on the presence of campaign labels; verify actual use.
- **Encryption in transit:** The public origin and first-party routes use HTTPS. The email transport requests implicit TLS on port 465; on other ports the code does not force TLS, so verify that the actual SMTP server negotiates STARTTLS. Check the SDK endpoints, database connection, SMTP configuration, and every production path before answering the Play encryption question.
- **Deletion:** There is no public account-creation flow, so there is no app account to delete in the current public experience. The privacy page offers a manual request by email; confirm the contact channel works and the owner can locate and delete records from the database and any email/provider copies. The policy currently states that the application has no automatic deletion period. If account creation is added later, re-check Google's account-deletion rules, including both in-app and external request paths.
- **Children / content rating:** The privacy policy says the app is not directed to children under 13. Choose the Play target audience and complete the content-rating questionnaire for the actual release; do not infer a rating from that privacy-policy sentence alone.

## Draft store listing copy (English source)

Review the product name and claims against the shipped website. Localized listing text has not been drafted here.

**App name** (11 characters):

> Aboalazm OS

**Short description** (71 characters):

> Explore projects, services, writing, and resources by Mustafa Aboalazm.

**Full description** (772 characters):

> Explore the work and ideas of Mustafa Aboalazm.
>
> Aboalazm OS brings together:
> • Selected digital projects and case studies
> • Services and project-enquiry options
> • Articles, learning resources, and media
> • Professional background and public links
>
> Browse in English, Arabic, or Malay. General browsing does not require an account. Some resource downloads and contact forms ask for your email; those details are used to deliver requested resources or respond to enquiries, as described in the privacy policy.
>
> The app opens content from the Aboalazm OS website. An internet connection is needed for current pages and downloads. Previously visited pages may remain available offline. Optional links to external services follow those services’ own terms and privacy policies.

**Privacy policy URL:** `https://aboalazm-os.vercel.app/privacy` — confirm that the final policy is accurate, accessible, and consistent with the release before publishing the listing.

## Play Console items still to prepare

- Reconcile this worksheet with the final TWA package, website/client code, third-party libraries, production environment variables, provider agreements, and provider dashboards/network behavior.
- Complete and owner-review the Data safety form, target audience, content rating, store category, and app-access declaration (if applicable).
- Prepare current phone screenshots and a **1024 × 500 px feature graphic**; verify the Play Console's asset specifications at upload time.
- Confirm the privacy-policy URL and contact/deletion-request process; localize listing/policy materials as needed.
- For this newly created personal developer account, complete a closed test with at least **12 testers opted in continuously for 14 days** before requesting production access. See [`TWA_SETUP.md`](./TWA_SETUP.md) for the release sequence.

## References

- [Google Play: Provide information for the Data safety section](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) — includes data handled in developer-controlled WebViews and third-party SDKs, and defines service-provider transfers.
- [Google Play: Account deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en)
- [Google Play: Testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en)
- [Current privacy policy in the app](https://aboalazm-os.vercel.app/privacy)
