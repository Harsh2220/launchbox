import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/getAllTokens`,
      {
        method: "GET",
      }
    );

    const data = await response.json();

    console.log("this is next response", data);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
