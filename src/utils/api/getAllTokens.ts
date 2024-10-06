import { Token } from "@/types/token";

export default async function getAllTokens(): Promise<Token[]> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/getAllTokens`,
      {
        headers: {
          Accept: "*/*",
          "ngrok-skip-browser-warning": "ss",
        },
      }
    );

    const data: Token[] = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
