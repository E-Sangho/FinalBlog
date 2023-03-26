import Layout from "@/components/layout";
import { Post } from "@prisma/client";
import Image from "next/image";
import { motion } from "framer-motion";
import useSWR from "swr";
import axios from "axios";

interface IPostsResponse {
	success: boolean;
	posts: Post[];
}

export default function Home() {
	const { data } = useSWR<IPostsResponse>("api/posts");
	console.log(data);
	return (
		<Layout>
			<div className="w-full min-h-screen relative">
				<Image
					src="/giphy.gif"
					alt="heroGif"
					width={1600}
					height={900}
					className="-z-10 absolute top-0 left-0 w-full min-h-screen"
				></Image>
				<div className="opacity-20 bg-gray-700 z-10 w-full min-h-screen"></div>
				<motion.div
					initial={{ translateX: "-50%" }}
					animate={{ y: [0, 30, 0] }}
					className="absolute left-1/2 top-3/4"
					transition={{ repeat: Infinity, duration: 2 }}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="1.5"
						className="w-10 h-10 stroke-white"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							stroke="f97316"
							d="M19.5 5.25l-7.5 7.5-7.5-7.5m15 6l-7.5 7.5-7.5-7.5"
						/>
					</svg>
				</motion.div>
				<div className="font-mabinogi text-center w-full h-16">
					제 블로그에 오신 것을 진심으로 환영합니다!
					{data?.posts[0].view}
				</div>
			</div>
		</Layout>
	);
}

export async function getServerSideProps() {
	try {
		await axios.post("/api/recordVisit");
	} catch (error) {
		console.error("Error recording visit:", (error as Error).message);
	}

	return { props: {} };
}
