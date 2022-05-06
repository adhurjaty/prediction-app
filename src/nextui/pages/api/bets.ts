import type { NextApiRequest, NextApiResponse } from "next"
import { get, toResponse } from "@/utils/apiInterface"

const Bets = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await get(`http://localhost:5000/bets`, req));
    console.log(response);
    res.send(response);
}

export default Bets;