import Comment from "@/components/Comment";
import Layout from "@/components/layout";
import MarkdownRenderer from "@/components/markdownRenderer";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { sample } from "../../util/mdSample";
import useSWR from "swr";
import { Post, User } from "@prisma/client";

interface PostWithUser extends Post {
	user: User;
}

interface PostResponse {
	success: boolean;
	post: PostWithUser;
	isLiked: boolean;
}

export default function ReadPost() {
	const textSample = `\`\`\`javascript\nlet a = 0;\nlet b = 0;\nfor (int i = 0; i < 10; ++i) {\n	console.log("hello");\n}\n\`\`\``;
	const title = "Post Title";
	const postImage =
		"https://w.namu.la/s/95f3898eb4996f6ba5a3930b212b295da56e062e9427da87331a510d3d868bd81f24d10d242ca0d93f4ad94053b9321549cb4590ea815a8d39ba92cde1a7da445f694cd13513124c3f6d61e456014a1e0d9a3b6cbe7a28b94c757fbd60bce446";
	const numberOfVisits = 0;
	const numberOfComments = 0;
	const summary = "This is summary of the Post";
	const date = "2023-02-12 15:45:06";
	const category = "Java";
	const tags = ["Java", "Backend", "CS"];
	const router = useRouter();
	const { data } = useSWR<PostResponse>(
		router.query.title ? `/api/posts/${router.query.title}` : null
	);
	return (
		<Layout>
			<div className="relative">
				<div className="w-full h-96 opacity-60 bg-black absolute"></div>
				<div className="w-full overflow-hidden">
					<img
						src={postImage}
						className="object-fill object-center h-96 mx-auto"
					/>
				</div>
				<div className="w-full h-96 absolute top-0 flex justify-center items-center text-4xl text-slate-100">
					{title}
				</div>
				<div className="w-full h-96 absolute top-0 flex justify-end items-end text-xl text-slate-100 px-8 py-8">
					{date.substring(0, 10)}
				</div>
			</div>
			<div className="mx-16 my-32">
				<MarkdownRenderer text={textSample} />
			</div>
			<form className="mx-16 bg-gray-100 rounded-2xl">
				<div className="px-4 py-4">
					<div className="flex items-center">
						<div className="rounded-full bg-gray-300 w-8 h-8 text-gray-200 px-2 py-2 mr-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								fill="currentColor"
								width="100%"
								height="100%"
							>
								<path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z" />
							</svg>
						</div>
						<div className="text-gray-400">로그인 후 작성할 수 있습니다.</div>
					</div>
					<div className="w-full h-24"></div>
				</div>
				<div className="flex flex-row-reverse px-4 py-4">
					<button className="px-4 py-1 bg-gray-300 rounded-2xl text-gray-50">
						등록
					</button>
				</div>
			</form>
			<div className="mx-16">
				{[1, 1, 1, 1].map((_, index) => (
					<Comment isReversed={false} key={index} />
				))}
			</div>
		</Layout>
	);
}
