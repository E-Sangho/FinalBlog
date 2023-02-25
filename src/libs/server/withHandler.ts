import { NextApiRequest, NextApiResponse } from "next";

interface ConfigType {
	methods: method[];
	handler: (req: NextApiRequest, res: NextApiResponse) => void;
	isPrivate?: boolean;
}

type method = "GET" | "POST" | "DELETE";

export default function withHandler({
	methods,
	handler,
	isPrivate = true,
}: ConfigType) {
	return async function (
		req: NextApiRequest,
		res: NextApiResponse
	): Promise<any> {
		if (req.method && !methods.includes(req.method as any)) {
			res.status(405).end();
		}

		if (isPrivate && !req.session.user) {
			return res.status(401).json({ isLogin: false });
		}

		try {
			await handler(req, res);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error });
		}
	};
}
