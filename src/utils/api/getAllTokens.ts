export default async function getAllTokens() {
    const res = await fetch(`/api/tokens`, {
        method: "GET",
    })
    const data = await res.json()
    return data
}
