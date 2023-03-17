import Layout from "@/components/layout";
import PostCard from "@/components/PostCard";
import useMutation from "@/libs/client/useMutation";
import usePosts from "@/libs/client/usePosts";
import { Post } from "@prisma/client";
import { useEffect } from "react";
import { imageURL } from "@/util/imageURL";

export default function Posts() {
	const { posts, isLoading } = usePosts();
	console.log(posts);
	console.log(isLoading);
	return (
		<Layout>
			<div className="max-w-5xl grid grid-cols-3 px-8 py-8 mx-auto gap-8">
				{isLoading ? (
					<div>now Loading...</div>
				) : (
					<>
						{posts ? (
							posts.map((post, index) => (
								<PostCard
									id={`PostCard-${index}`}
									title={post.title}
									postImage={`${imageURL(post.titleImage)}`}
									numberOfVisits={post.view}
									numberOfComments={0}
									summary={`${post.contents.substring(0, 100)}...`}
									date={post.contents.toString()}
									category="java"
									tags={["Java", "Backend", "CS"]}
									key={post.title}
								/>
							))
						) : (
							<div>There is no posts</div>
						)}
					</>
				)}
			</div>
		</Layout>
	);
}
