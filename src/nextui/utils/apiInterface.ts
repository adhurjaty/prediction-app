import { Err, Ok, Result } from "@sniptt/monads/build";
import axios, { AxiosResponse } from "axios";
import sign from "jwt-encode";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;

async function generateToken(req: NextApiRequest) {
    const token = await getToken({ req, secret });
    return sign(token, secret);
}

function authHeader(encodedToken: string) {
    return {
        Authorization: `Bearer ${encodedToken}`,
    };
}

function toResult(response: AxiosResponse): Result<any, string> {
    if (response.status >= 200 && response.status < 300) {
        return Ok(response.data);
    } else {
        return Err(response.statusText);
    }
}

export async function get(url: string, req: NextApiRequest) {
    const encodedToken = await generateToken(req);
    return toResult(await axios.get(url, {
        headers: authHeader(encodedToken),
    }));
}

export async function post(url: string, data: any, req: NextApiRequest) {
    const encodedToken = await generateToken(req);
    return toResult(await axios.post(url, {
        headers: authHeader(encodedToken),
        body: data,
    }));
}

export function toResponse(result: Result<any, string>): { result: any } | { error: string } {
    return result.match({
        ok: data => ({ result: data }),
        err: err => ({ error: err })
    });
}

