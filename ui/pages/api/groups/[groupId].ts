import type { NextApiRequest, NextApiResponse } from "next"
import { get, put, toResponse } from "@/utils/apiInterface"

const GetGroup = async (req: NextApiRequest, res: NextApiResponse) => {
    const { groupId } = req.query;
    const response = toResponse(await get(`/groups/${groupId}`, req));
    res.send(response);
}

const UpdateGroup = async (req: NextApiRequest, res: NextApiResponse) => {
    const { groupId } = req.query;
    const response = toResponse(await put(`/groups/${groupId}`, req));
    res.send(response);
}

const Group = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "PUT") await UpdateGroup(req, res);
    if (req.method === "GET") await GetGroup(req, res);
}

export default Group;