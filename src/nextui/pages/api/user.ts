import type { NextApiRequest, NextApiResponse } from "next"
import { toResponse, post } from "@/utils/apiInterface";

const CreateUser = async (req: NextApiRequest, res: NextApiResponse) => {
    const response = toResponse(await post(`http://localhost:5000/user`, req));
    res.send(response);
}

export default CreateUser;