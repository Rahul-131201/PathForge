import { NextRequest, NextResponse } from "next/server";

// This route is a placeholder for tRPC integration.
// To enable tRPC, install: @trpc/server @trpc/client @trpc/next
// Then replace this with the tRPC Next.js handler.

export async function GET(_req: NextRequest) {
  return NextResponse.json(
    { message: "tRPC endpoint — configure @trpc/server to activate." },
    { status: 501 }
  );
}

export async function POST(_req: NextRequest) {
  return NextResponse.json(
    { message: "tRPC endpoint — configure @trpc/server to activate." },
    { status: 501 }
  );
}
