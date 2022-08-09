import { errAsync, okAsync, Result, ResultAsync } from "neverthrow";

export function fetchModel<T>(url: string, signal?: AbortSignal): ResultAsync<T, string> {
    return ResultAsync.fromPromise(
            fetch(url, { signal }).then(res => res.json()),
            e => e as string)
        .map(json => json.result as T);
}

export function postModel<T>(url: string, model: any): ResultAsync<T, string> {
    return ResultAsync.fromPromise(
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(model),
        }).then(res => res.json()),
        e => e as string)
    .map(json => json.result as T);
}

export function putModel<T>(url: string, model: any): ResultAsync<T, string> {
    return ResultAsync.fromPromise(
        fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(model),
        }).then(res => res.json()),
        e => e as string)
    .map(json => json.result as T);
}