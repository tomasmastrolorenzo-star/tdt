
import { SignJWT, jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'fallback-secret-for-dev-only-do-not-use-in-prod'
)

export async function createLeadToken(payload: any) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(SECRET)
}

export async function verifyLeadToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, SECRET)
        return payload
    } catch (error) {
        return null
    }
}
