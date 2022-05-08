import type { NextApiRequest, NextApiResponse } from "next"
import { get, post, toResponse } from "@/utils/apiInterface"


const GetBets = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await get(`http://localhost:5000/bets`, req));
    console.log(response);
    res.send(response);
}

const CreateBet = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await post(`http://localhost:5000/bets`, req));
    console.log(response);
    res.send(response);
}

const Bets = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") await CreateBet(req, res);
    if (req.method === "GET") await GetBets(req, res);
}

export default Bets;