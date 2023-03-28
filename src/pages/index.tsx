import Layout from "@/components/layout";
import { Post } from "@prisma/client";
import Image from "next/image";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import useSWR from "swr";
import axios from "axios";
import { useEffect } from "react";

interface IPostsResponse {
	success: boolean;
	posts: Post[];
}

interface IProps {
	initialData: {
		viewCount: number;
		postCount: number;
	};
}

export default function Home({ initialData }: IProps) {
	const { viewCount, postCount } = initialData;
	const viewMotionCount = useMotionValue(0);
	const postMotionCount = useMotionValue(0);
	const viewChange = useTransform(viewMotionCount, (latest) =>
		Math.round(latest)
	);
	const postChange = useTransform(postMotionCount, (latest) =>
		Math.round(latest)
	);

	useEffect(() => {
		const viewControls = animate(viewMotionCount, viewCount);
		const postControls = animate(postMotionCount, postCount);
		console.log(viewChange);
		viewControls.stop;
		postControls.stop;
		return;
	}, []);
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
				</div>
				<motion.div>{viewChange}</motion.div>
				<motion.div>{postChange}</motion.div>
			</div>
		</Layout>
	);
}

export async function getServerSideProps() {
	const response = await fetch("http://localhost:3000/api/blogData");
	const blogData = await response.json();

	return { props: { initialData: blogData } };
}
