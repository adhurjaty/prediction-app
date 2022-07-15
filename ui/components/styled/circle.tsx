import styled from "styled-components";

const Circle = styled.div`
    background: $background;
    width: 50px;
    height: 50px;
    border-radius: 99px;
    overflow: hidden;
    display: grid;
    place-content: center;
    font-size: 32px;
    margin-right: 10px;
    
    .selected {
        width: 50px;
        height: 50px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        &:before {
            content: '';
            width: 11px;
            height: 23px;
            position: absolute;
            left: 18px;
            top: 8px;
            opacity: 0;
            transform: rotate(45deg);
            border-right: 6px solid #fff;
            border-bottom: 6px solid #fff;
            transition: opacity .5s;
        }
    }
`;

export default Circle;