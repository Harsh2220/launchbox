export default async function getConfig(id: string) {
    const res = await fetch("/api/config", {
        method: "POST",
        body: JSON.stringify({
            token_id: id
        })
    })
    const data = await res.json()
    return data
}
