import { Err, Ok, Result } from "@sniptt/monads/build";

export async function fetchModel<T>(url: string): Promise<Result<T, string>> {
    const res = await fetch(url);
    const { result, error } = await res.json();
    return error ? Err(error as string) : Ok(result as T);
}