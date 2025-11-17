import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function PUT(
  request: NextRequest,
  context: any
) {
  try {
    const id = context.params?.id;
    if (!id) {
      return NextResponse.json({ error: "Project ID required" }, { status: 400 });
    }

    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 });
    }

    const response = await fetch(`${BACKEND_URL}/api/projects/${id}/approve`, {
      method: "PUT",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData || { error: "Failed to approve project" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("[PUT /api/projects/[id]/approve] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}