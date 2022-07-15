import { useRouter } from "next/router";
import styled from "styled-components";

const ArrowButton = styled.div`
    background: $green-button;
    align-self: center;
    margin-right: 10px;
`;

const BackButton = () => {
    const router = useRouter();

    const goBack = () => {
        if (document.referrer === '') {
            // may want to do something like this in the future
            // const pathParts = router.asPath.split('/');
            // const path = pathParts.slice(0, pathParts.length - 1).join('/');
            // router.replace(path);
            router.replace("/groups");
        }
        else {
            router.back();
        }
    }

    return (
        <ArrowButton onClick={goBack}>
            <svg width="33" height="24" viewBox="0 0 33 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.939339 10.9042C0.353554 11.49 0.353554 12.4398 0.939339 13.0256L10.4853 22.5715C11.0711 23.1573 12.0208 23.1573 12.6066 22.5715C13.1924 21.9857 13.1924 21.036 12.6066 20.4502L4.12132 11.9649L12.6066 3.47962C13.1924 2.89384 13.1924 1.94409 12.6066 1.3583C12.0208 0.772516 11.0711 0.772516 10.4853 1.3583L0.939339 10.9042ZM33 10.4649L2 10.4649V13.4649L33 13.4649V10.4649Z" fill="white"/></svg>
        </ArrowButton>
    )
}

export default BackButton;