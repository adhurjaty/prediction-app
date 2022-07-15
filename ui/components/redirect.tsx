import { useRouter } from 'next/router';
import { useEffect } from 'react';

interface Props {
    path: string;
}

const Redirect = ({ path }: Props) => {
    const router = useRouter();

    useEffect(() => {
    
        router.push({
            pathname: path,
        });
    });

    return (
        <></>
    )
}

export default Redirect