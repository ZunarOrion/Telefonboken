import * as jose from "jose";

const secret = new TextEncoder().encode(
    "GIo1kkI927PuvzXu7oBC5XzDdS2HIYRqan2zeEnx5CfJcih9UwfUyUbGUIyufztex"
);

const alg = "HS256";

export async function generateToken(data) {
    return await new jose.SignJWT(data)
    .setProtectedHeader({ alg })
    .sign(secret)
};

export async function validateToken(token) {
    try {
        const { payload } = await jose.jwtVerify(token, secret)
        return payload
    } catch (e) {
        console.log(error)
    };
};
