import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";

function handler(req: NextApiRequest, res: NextApiResponse) {
	console.log("register api works!");
	res.status(200).end();
}

export default withHandler("POST", handler);
