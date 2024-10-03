export default async function registerNewToken(request: RegisterNewTokenRequest) {
    const res = await fetch("/api/token/register", {
        method: "POST",
        body: JSON.stringify(request)
    })
    const data = await res.json()
    return data
}
