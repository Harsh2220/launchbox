export default async function getStatus(id: string) {
  try {
    console.log(
      "query",
      `${process.env.NEXT_PUBLIC_BASE_URL}/status/?id=${id}`
    );

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/getStatus?id=${id}`,
      {
        headers: {
          Accept: "*/*",
          "ngrok-skip-browser-warning": "ss",
        },
      }
    );
    console.log(res);

    if (!res.ok) {
      throw new Error(`Error: ${res.statusText}`);
    }

    const json = await res.json();

    return json;
  } catch (error) {
    console.log(error);
  }
}
