export default async function getStatus(id: string) {
    const res = await fetch(`/api/status?id=${id}`, {
        method: "GET",
    })
    const data = await res.json()
    return data
}
