import { userCollection } from "../services/db.ts";
import { generateToken } from "../services/jwt.ts";


export async function createUser ({req, res}) {
    const formData = req.body
    const email = formData.email
    const password = formData.password
    
    try {
        await userCollection.insertOne({
            email: email,
            password: password
        });
    } catch (e) {
        console.log(e)
    };
    return res.send(generateToken({
        email: email,
        role: "user"
    }));



//     const jwt = await new jose.SignJWT(data)
//     .setProtectHeader({alg})
//     .sign(secret)
    
//     return res.send(jwt)
// };
// const secret = new TextEncoder().encode{
//     ""
// };

// const alg = "HS256"
