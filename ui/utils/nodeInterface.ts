import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";

export function fetchModel<T>(url: string, signal?: AbortSignal): ResultAsync<T, string> {
    return responseToResult<T>(fetch(url, { signal }));
}

export function postModel<T>(url: string, model: any): ResultAsync<T, string> {
    return responseToResult<T>(
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(model),
        }));
}

export function putModel<T>(url: string, model: any): ResultAsync<T, string> {
    return responseToResult<T>(
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(model),
        }));
}

function responseToResult<T>(response: Promise<Response>): ResultAsync<T, string> {
    return ResultAsync.fromPromise(
        response.then(res => res.json()),
        e => (e as any | undefined)?.message as string | undefined || e as string
    ).andThen(({ result, error }) => {
        return error ? errAsync(error as string) : okAsync(result as T);
    });
}