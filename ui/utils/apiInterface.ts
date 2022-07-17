import { Err, Ok, Result } from "@sniptt/monads/build";
import axios, { AxiosResponse, AxiosError } from "axios";
import sign from "jwt-encode";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET;
const API_DOMAIN = process.env.API_DOMAIN || "http://localhost:5000";

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
        if ((err as AxiosError).isAxiosError) {
            return Err((err as AxiosError).response?.data
                || (err as Error).message
                || "Missing axios error data");
        }
        if (err instanceof Error) {
            return Err(err.message);
        }
        if (typeof err === "string") {
            return Err(err);
        }
        return Err("Unknown fetch error");
    }
}

export async function get(path: string, req: NextApiRequest) {
    const encodedToken = await generateToken(req);
    const url = createUrl(path);
    return toResult(() => axios.get(url, {
        headers: authHeader(encodedToken),
    }));
}

export async function post(path: string, req: NextApiRequest) {
    const encodedToken = await generateToken(req);
    const url = createUrl(path);
    return toResult(() => axios.post(url, req.body, {
        headers: authHeader(encodedToken),
    }));
}

export async function put(path: string, req: NextApiRequest) {
    const encodedToken = await generateToken(req);
    const url = createUrl(path);
    return toResult(() => axios.put(url, req.body, {
        headers: authHeader(encodedToken),
    }));
}

function createUrl(path: string) {
    return `${API_DOMAIN}${path}`;
}

export function toResponse(result: Result<any, string>): { result: any } | { error: string } {
    return result.match({
        ok: data => ({ result: data }),
        err: err => ({ result: null, error: err })
    });
}

