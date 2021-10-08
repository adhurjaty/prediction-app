export function authorize<T>(
    target: Object,
    key: string | symbol,
    descriptor: PropertyDescriptor
    )
{
    const fn = descriptor.value;
    descriptor.value = async function (...args: any[]) {
        try {
            return await fn.apply(this, args);
        } catch (e) {
            if (e instanceof Error && e.message.includes('Unauthorized')) {
                window.location.href = `/login?origin=${window.location.pathname}`;
                return null;
            }
            throw e;
        }
    };
    return descriptor;
}
