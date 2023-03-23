import Layout from "@/components/layout";
import { Post } from "@prisma/client";
import useSWR from "swr";
import Image from "next/image";

interface IPostsResponse {
	success: boolean;
	posts: Post[];
}

export default function Home() {
	// const { data } = useSWR<IPostsResponse>("api/posts");
	return (
		<Layout>
			<div>
				<Image
					src="/giphy.gif"
					alt="heroGif"
					width={1600}
					height={900}
					className="-z-10 absolute top-0 left-0 w-full h-full"
				></Image>
			</div>
		</Layout>
	);
}
