export default async function getConfig(id: string) {
  try {
    const res = await fetch("http://localhost:8080/getBridgeConfig", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token_id: id,
      }),
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
