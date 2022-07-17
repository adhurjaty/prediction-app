import type { NextApiRequest, NextApiResponse } from "next"
import { get, toResponse } from "@/utils/apiInterface"

const FullUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await get(`/fullUser`, req));
    res.send(response);
}

export default FullUser;