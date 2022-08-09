import config from "@/appConfig";
import { err, Err, ok, Ok, Result } from "neverthrow";
import axios, { AxiosResponse, AxiosError } from "axios";
import sign from "jwt-encode";
import { NextApiRequest } from "next";
import { getToken } from "next-auth/jwt";

const secret = config.apiSecret;
const API_DOMAIN = config.apiDomain;

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
            return ok(response.data);
        } else {
            return err(response.statusText);
        }
    } catch (error) {
        if ((error as AxiosError).isAxiosError) {
            return err((error as AxiosError).response?.data
                || (error as Error).message
                || "Missing axios error data");
        }
        if (error instanceof Error) {
            return err(error.message);
        }
        if (typeof error === "string") {
            return err(error);
        }
        return err("Unknown fetch error");
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
    return result.match(data => ({ result: data }),
        err => ({ result: null, error: err }));
}

