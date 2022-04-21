import { getToken } from "next-auth/jwt"
import type { NextApiRequest, NextApiResponse } from "next"
import axios from "axios"
import sign from "jwt-encode"

const secret = process.env.NEXTAUTH_SECRET

export default async (req: NextApiRequest, res: NextApiResponse) => {
    const token = await getToken({ req, secret });
    console.log(token);
    var encoded = sign(token, secret);
    console.log(encoded);
    const { data: response } = await axios.get("http://localhost:5000/groups", {
        headers: {
            'Authorization': `Bearer ${encoded}`
        }
    }) as { data: any };
    console.log(response);
    res.send(response);
}