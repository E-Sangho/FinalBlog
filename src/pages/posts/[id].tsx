import Layout from "@/components/layout";
import MarkdownRenderer from "@/components/markdownRenderer";
import { useEffect } from "react";
import { sample } from "../../util/mdSample";

export default function ReadPost() {
	const textSample = sample;
	const title = "Post Title";
	const postImage =
		"https://w.namu.la/s/95f3898eb4996f6ba5a3930b212b295da56e062e9427da87331a510d3d868bd81f24d10d242ca0d93f4ad94053b9321549cb4590ea815a8d39ba92cde1a7da445f694cd13513124c3f6d61e456014a1e0d9a3b6cbe7a28b94c757fbd60bce446";
	const numberOfVisits = 0;
	const numberOfComments = 0;
	const summary = "This is summary of the Post";
	const date = "2023-02-12 15:45:06";
	const category = "Java";
	const tags = ["Java", "Backend", "CS"];
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
		</Layout>
	);
}
