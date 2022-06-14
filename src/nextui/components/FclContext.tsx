import DelphaiInterface from "@/contracts/delphaiInterface";
import { createContext } from "react";

const FclContext = createContext(undefined as DelphaiInterface | undefined);

export default FclContext;