export default async function Migrate(request: MigrateRequest) {
    const res = await fetch("/api/migrate", {
        method: "POST",
        body: JSON.stringify(request)
    })
    const data = await res.json()
    return data
}
