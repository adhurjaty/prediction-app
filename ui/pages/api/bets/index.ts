import type { NextApiRequest, NextApiResponse } from "next"
import { get, post, toResponse } from "@/utils/apiInterface"


const GetBets = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await get(`/bets`, req));
    res.send(response);
}

const CreateBet = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await post(`/bets`, req));
    res.send(response);
}

const Bets = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") await CreateBet(req, res);
    if (req.method === "GET") await GetBets(req, res);
}

export default Bets;