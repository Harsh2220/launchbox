export default async function registerMigration(request: RegisterNewTokenRequest) {
    const res = await fetch("/api/register-migration", {
        method: "POST",
        body: JSON.stringify(request)
    })
    const data = await res.json()
    return data
}
