import Layout from "@/components/layout";
import PostCard from "@/components/PostCard";

export default function Posts() {
	return (
		<Layout>
			<div className="max-w-5xl grid grid-cols-3 px-8 py-8 mx-auto gap-8">
				{[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map(
					(_, index) => (
						<PostCard
							id={`PostCard-${index}`}
							title="Post Title"
							postImage="https://w.namu.la/s/95f3898eb4996f6ba5a3930b212b295da56e062e9427da87331a510d3d868bd81f24d10d242ca0d93f4ad94053b9321549cb4590ea815a8d39ba92cde1a7da445f694cd13513124c3f6d61e456014a1e0d9a3b6cbe7a28b94c757fbd60bce446"
							numberOfVisits={0}
							numberOfComments={0}
							summary="This is summary of the Post"
							date={"2023-02-12 15:45:06"}
							category="Java"
							tags={["Java", "Backend", "CS"]}
						/>
					)
				)}
			</div>
		</Layout>
	);
}
