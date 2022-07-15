import { useRouter } from 'next/router'

const NoAuthPage = () => {
    const router = useRouter();

    router.push({
        pathname: "/api/auth/signin",
        query: { redirectUrl: router.asPath }
    });
    return (
        <></>
    )
};

export default NoAuthPage
