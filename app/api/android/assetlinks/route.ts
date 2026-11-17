import { NextResponse } from "next/server";
import { createAndroidAssetLinks } from "@/lib/android-assetlinks";

// The statement depends on signing certificates entered after the first Android
// build and after Play App Signing is configured. Do not bake it into a build.
export const dynamic = "force-dynamic";

export function GET() {
  const statement = createAndroidAssetLinks(process.env.ANDROID_SHA256_CERT_FINGERPRINTS);

  if (!statement) {
    return NextResponse.json(
      { error: "android_assetlinks_not_configured" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(statement, {
    headers: { "Cache-Control": "public, max-age=300, must-revalidate" },
  });
}
