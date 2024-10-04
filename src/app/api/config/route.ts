import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("body", body.token_id);
    const response = await fetch(`${process.env.BASE_URL}/getBridgeConfig`, {
      method: "POST",
      body: JSON.stringify({
        token_id: body.token_id,
      }),
    });

    const data = await response.json();

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 },
    );
  }
}
