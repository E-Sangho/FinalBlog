import withHandler from "@/libs/server/withHandler";
import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
import { withApiSession } from "@/libs/server/withSession";
import { hashPassword } from "@/libs/server/bcrypt";

async function handler(req: NextApiRequest, res: NextApiResponse) {
	const response = await fetch(
		`https://api.cloudflare.com/client/v4/accounts/${process.env.CloudFlare_Account_ID}/images/v1/direct_upload`,
		{
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${process.env.Images_Token}`,
			},
		}
	);
	const data = await response.json();
	console.log(data);
	res.json({
		isAPISuccessful: true,
		...data.result,
	});
}

export default withApiSession(
	withHandler({
		methods: ["GET"],
		handler: handler,
		isPrivate: false,
	})
);
