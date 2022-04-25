import type { NextApiRequest, NextApiResponse } from "next"
import { get, toResponse } from "@/utils/apiInterface"

const Group = async (req: NextApiRequest, res: NextApiResponse) => {
    const { groupId } = req.query;
    const response = toResponse(await get(`http://localhost:5000/groups/${groupId}`, req));
    res.send(response);
}

export default Group;