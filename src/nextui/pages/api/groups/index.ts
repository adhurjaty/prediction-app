import type { NextApiRequest, NextApiResponse } from "next"
import { get, toResponse } from "@/utils/apiInterface"

const Groups = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await get("http://localhost:5000/groups", req));
    res.send(response);
}

export default Groups;