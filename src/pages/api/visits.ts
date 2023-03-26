import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";
import withHandler from "@/libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "GET") {
		const totalVisits = await client.visit.count();
		const uniqueVisitors = await client.visit.count({
			distinct: ["ipAddress"],
		});

		res.status(200).json({ totalVisits, uniqueVisitors });
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}

export default withApiSession(
	withHandler({
		methods: ["GET"],
		handler,
	})
);
