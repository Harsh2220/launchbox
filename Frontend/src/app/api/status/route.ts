import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");

        const response = await fetch(`${process.env.BASE_URL}/getStatus?migrationId=${id}`, {
            method: "GET",
        })

        const data = await response.json()

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}