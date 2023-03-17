interface PostCardProps {
	id: string;
	title: string;
	postImage: string;
	numberOfVisits: number;
	numberOfComments: number;
	summary: string;
	date: string;
	category: string;
	tags: string[];
}

export default function PostCard({
	id,
	title,
	postImage,
	numberOfVisits,
	numberOfComments,
	summary,
	date,
	category,
	tags,
}: PostCardProps) {
	return (
		<div
			id={id}
			className="max-w-xs border-2 rounded-2xl px-4 py-4 inline-block shadow-lg"
		>
			<div className="overflow-hidden">
				<img
					src={postImage}
					className="w-full h-20 object-contain object-center"
				/>
			</div>
			<a href={`posts/${title}`}>
				<div className="text-xl text-">{title}</div>
			</a>
			<div>
				<div className="inline-block rounded-2xl bg-red-400 text-slate-100 text-sm px-2 mt-2">
					{category}
				</div>
			</div>
			<div className="text-sm opacity-50 w-full my-4">{summary}</div>
			<div className="flex justify-between">
				<div className="text-xs opacity-50">{date.substring(0, 10)}</div>
				<div className="flex gap-4">
					<div className="text-sm">조회수({numberOfVisits})</div>
					<div className="text-sm">댓글수({numberOfComments})</div>
				</div>
			</div>
		</div>
	);
}
