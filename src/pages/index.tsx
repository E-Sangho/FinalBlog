import Layout from "@/components/layout";
import { Post } from "@prisma/client";
import useSWR from "swr";

interface IPostsResponse {
	success: boolean;
	posts: Post[];
}

export default function Home() {
	const { data } = useSWR<IPostsResponse>("api/posts");
	console.log(data);
	return (
		<Layout>
			<div></div>
		</Layout>
	);
}
