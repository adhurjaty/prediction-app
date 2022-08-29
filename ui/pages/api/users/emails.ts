import { NextApiRequest, NextApiResponse } from "next";
import { toResponse, get } from "@/utils/apiInterface";

const Emails = async (req: NextApiRequest, res: NextApiResponse) => {
    const searchParam = encodeURI(req.query.search as string);
    const response = toResponse(await get(`/users/emails?search=${searchParam}`, req));
    res.send(response);
}

export default Emails;