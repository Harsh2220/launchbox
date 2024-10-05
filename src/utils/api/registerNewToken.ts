export default async function registerNewToken(
  request: RegisterNewTokenRequest
) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/registerNewToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
    });

    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.log(error);
  }
}
