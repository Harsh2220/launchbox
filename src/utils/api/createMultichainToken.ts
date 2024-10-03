export default async function CreateMultichainToken(request: CreateMultichainToken) {
    const res = await fetch("/api/token/create", {
        method: "POST",
        body: JSON.stringify(request)
    })
    const data = await res.json()
    return data
}
