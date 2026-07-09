import { NextResponse } from "next/server";
import { submitTestResult } from "@/actions/testResultActions";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    await submitTestResult(formData);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Test result API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to save test result." },
      { status: 500 }
    );
  }
}
