import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("login api works!");
	return res.status(200).end();
}

export default withHandler("POST", handler);
