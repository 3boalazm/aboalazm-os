import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(
    new URL("/Mustafa_Taha_Brand_Identity_CV.docx", process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  );
}
