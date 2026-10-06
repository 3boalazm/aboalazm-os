import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.redirect(
    new URL("/Mustafa_Taha_Brand_Identity_CV.docx", request.url),
  );
}
