import { NextResponse } from "next/server";

interface InquiryPayload {
  email?: string;
  track?: string;
  timeline?: string;
  brief?: string;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InquiryPayload;
    const email = (body.email ?? "").trim();
    const track = (body.track ?? "general").trim();
    const timeline = (body.timeline ?? "3-6 weeks").trim();
    const brief = (body.brief ?? "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    if (brief.length < 10) {
      return NextResponse.json(
        { error: "Please share at least a short sentence about your project." },
        { status: 400 }
      );
    }

    const referenceId = `JX-${new Date().getFullYear()}-${Math.random()
      .toString(36)
      .slice(2, 7)
      .toUpperCase()}`;

    const webhookUrl = process.env.JXLAB_INQUIRY_WEBHOOK_URL;
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          referenceId,
          email,
          track,
          timeline,
          brief,
          receivedAt: new Date().toISOString(),
        }),
      }).catch(() => undefined);
    }

    return NextResponse.json({
      ok: true,
      referenceId,
      message: `Project brief ${referenceId} logged for ${email}. Our architecture lead will reply within 24 hours.`,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }
}
