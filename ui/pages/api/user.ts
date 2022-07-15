import type { NextApiRequest, NextApiResponse } from "next"
import { toResponse, post, get } from "@/utils/apiInterface";

const GetUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const emailParam = encodeURI(req.query.email as string);
    const response = toResponse(await get(`http://localhost:5000/user?email=${emailParam}`, req));
    res.send(response);
}

const CreateUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await post(`http://localhost:5000/user`, req));
    res.send(response);
}

const Users = async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method == "POST") await CreateUser(req, res);
    if (req.method === "GET") await GetUser(req, res);
}

export default Users;