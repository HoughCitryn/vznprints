import { NextResponse } from "next/server";
import { contactSchema, type SubmissionResponse } from "@/lib/forms";
import { sendContactEmail, verifyTurnstile } from "@/lib/submissions";

export const runtime = "nodejs";
// Allow both the 10-second verification and 15-second mail request to finish.
export const maxDuration = 30;

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json<SubmissionResponse>({ status: "validation_error" }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json<SubmissionResponse>(
      { status: "validation_error", fieldErrors: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json<SubmissionResponse>({ status: "spam_rejected" }, { status: 400 });
  }

  try {
    const validToken = await verifyTurnstile(
      parsed.data.turnstileToken,
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    );
    if (!validToken) {
      return NextResponse.json<SubmissionResponse>({ status: "spam_rejected" }, { status: 403 });
    }
    await sendContactEmail(parsed.data);
    return NextResponse.json<SubmissionResponse>({ status: "success" });
  } catch {
    return NextResponse.json<SubmissionResponse>({ status: "delivery_error" }, { status: 500 });
  }
}
