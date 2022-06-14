import { Err, Ok, Result } from "@sniptt/monads/build";

export async function fetchModel<T>(url: string, signal?: AbortSignal): Promise<Result<T, string>> {
    const res = await fetch(url, { signal });
    const { result, error } = await res.json();
    return error ? Err(error as string) : Ok(result as T);
}

export async function postModel<T>(url: string, model: any): Promise<Result<T, string>> {
    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(model),

    });
    const { result, error } = await res.json();
    return error ? Err(error as string) : Ok(result as T);
}