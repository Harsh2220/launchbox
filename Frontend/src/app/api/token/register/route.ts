import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body", body);

    const response = await fetch(`${process.env.BASE_URL}/registerNewToken`, {
      method: "POST",
      body: body,
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
