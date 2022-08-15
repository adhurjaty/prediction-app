import type { NextApiRequest, NextApiResponse } from "next"
import { get, post, toResponse } from "@/utils/apiInterface"

const TransferTokens = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await post(`/bets/${req.query.betId}/transferTokens`, req));
    res.send(response);
};

export default TransferTokens;
