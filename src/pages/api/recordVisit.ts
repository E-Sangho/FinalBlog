import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";
import withHandler from "@/libs/server/withHandler";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method === "POST") {
		const rawIpAddress =
			req.headers["x-real-ip"] || req.connection.remoteAddress;
		const ipAddress = Array.isArray(rawIpAddress)
			? rawIpAddress[0]
			: rawIpAddress || null;

		await client.visit.create({
			data: {
				ipAddress,
			},
		});

		res.status(200).json({ message: "Visit recorded" });
	} else {
		res.status(405).json({ message: "Method not allowed" });
	}
}

export default withApiSession(
	withHandler({
		methods: ["POST"],
		handler,
	})
);
