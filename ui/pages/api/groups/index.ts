import type { NextApiRequest, NextApiResponse } from "next"
import { get, post, toResponse } from "@/utils/apiInterface"

const GetGroups = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await get("http://localhost:5000/groups", req));
    res.send(response);
}

const CreateGroup = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await post("http://localhost:5000/groups", req));
    res.send(response);
}

const Groups = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") await CreateGroup(req, res);
    if (req.method === "GET") await GetGroups(req, res);
}

export default Groups;