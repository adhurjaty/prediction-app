import DelphaiInterface from "@/contracts/delphaiInterface";
import { useEffect, useState } from "react";

export default function Test() {
    const [delphai, setDelphai] = useState<DelphaiInterface>();
    
    useEffect(() => {
        setDelphai(new DelphaiInterface());
    }, []);

    return (
        <div>Test</div>
    );
}