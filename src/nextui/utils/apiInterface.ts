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

async function toResult(requestFn: () => Promise<AxiosResponse>): Promise<Result<any, string>> {
    try {
        const response = await requestFn();
        if (response.status >= 200 && response.status < 300) {
            return Ok(response.data);
        } else {
            return Err(response.statusText);
        }
    } catch (err) {
        if (err instanceof Error)
            return Err(err.message);
        if (typeof err === "string")
            return Err(err)
        return Err("Unknown fetch error");
    }
}

export async function get(url: string, req: NextApiRequest) {
    const encodedToken = await generateToken(req);
    return toResult(() => axios.get(url, {
        headers: authHeader(encodedToken),
    }));
}

export async function post(url: string, data: any, req: NextApiRequest) {
    const encodedToken = await generateToken(req);
    return toResult(() => axios.post(url, {
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

