import { NextApiRequest, NextApiResponse } from "next";
import client from "@/libs/server/client";
let viewCount = 0;

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	viewCount++;
	const postCount = await client.post.count();
	res.status(200).json({ viewCount, postCount });
}
