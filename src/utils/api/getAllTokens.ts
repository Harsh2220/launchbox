import { Token } from "@/types/token";

export default async function getAllTokens(): Promise<Token[]> {
    const res = await fetch(`/api/tokens`, {
        method: "GET",
    })
    const data = await res.json()
    return data
}
