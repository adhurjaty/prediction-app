import { err, Err, ok, Ok, Result } from "neverthrow";

export async function fetchModel<T>(url: string, signal?: AbortSignal): Promise<Result<T, string>> {
    const res = await fetch(url, { signal });
    const { result, error } = await res.json();
    return error ? err(error as string) : ok(result as T);
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
    return error ? err(error as string) : ok(result as T);
}

export async function putModel<T>(url: string, model: any): Promise<Result<T, string>> {
    const res = await fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(model),
    });
    const { result, error } = await res.json();
    return error ? err(error as string) : ok(result as T);
}