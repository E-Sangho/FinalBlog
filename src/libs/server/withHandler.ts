import { NextApiRequest, NextApiResponse } from "next";

interface ConfigType {
	methods: method[];
	handler: (req: NextApiRequest, res: NextApiResponse) => void;
	isPrivate?: boolean;
}

export interface ResponseType {
	isAPISuccessful: boolean;
	[key: string]: any;
}

type method = "GET" | "POST" | "DELETE" | "PUT";

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
			return res.status(200).json({ isAPISuccessful: false, profile: null });
		}

		try {
			await handler(req, res);
		} catch (error) {
			console.log(error);
			return res.status(500).json({ error });
		}
	};
}
