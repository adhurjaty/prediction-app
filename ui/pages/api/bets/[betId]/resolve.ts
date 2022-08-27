import { post, toResponse } from "@/utils/apiInterface";
import { NextApiRequest, NextApiResponse } from "next";

const Resolve = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST") throw Error("Must be a POST request");

    console.log(req.headers);

    const response = toResponse(await post(`/bets/${req.query.betId}/resolve`, req));
    res.send(response);
}

export default Resolve;