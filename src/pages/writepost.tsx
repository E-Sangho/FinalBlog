import Layout from "@/components/layout";
import {
	ChangeEventHandler,
	DragEventHandler,
	KeyboardEvent,
	MouseEventHandler,
	useEffect,
	useState,
} from "react";
import { sample } from "@/util/mdSample";
import MarkdownRenderer from "@/components/markdownRenderer";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { Post } from "@prisma/client";
import { useRouter } from "next/router";
import useUser from "@/libs/client/useUser";

export interface FormValue {
	title: string;
	category: string;
	draft: boolean;
	titleImage: FileList;
	contents: string;
	tags: string;
}

interface IPostUpload {
	success: boolean;
	post: Post;
}

export default function writePost() {
	const router = useRouter();
	const user = useUser({ toLoginPage: true });
	const { register, watch, setValue, handleSubmit } = useForm<FormValue>({
		defaultValues: {
			contents: "",
		},
	});
	const [writePost, { loading, data, error }] =
		useMutation<IPostUpload>("/api/posts");
	const [images, setImages] = useState<string[]>([]);
	const sampleText = sample;
	let contents = watch("contents");
	// post image
	const [heroImagePreview, setHeroImagePreview] = useState("");
	const titleImage = watch("titleImage");
	useEffect(() => {
		if (titleImage && titleImage.length > 0) {
			const file = titleImage[0];
			setHeroImagePreview(URL.createObjectURL(file));
		}
	}, [titleImage]);
	// image drop event
	const imageDrop: DragEventHandler<HTMLTextAreaElement> = (event) => {
		event.preventDefault();
		let data = event.dataTransfer;
		let files = data.files;
		const url = URL.createObjectURL(files[0]);
		const image = `\n<img src="${url}" />`;
		setValue("contents", contents + image);
		setImages((prev) => [...prev, url]);
	};
	useEffect(() => {
		// When page loaded get text from localStorage and apply it.
		const savedText = localStorage.getItem("text");
		if (savedText) {
			setValue("contents", savedText);
		} else {
			setValue("contents", sampleText);
		}
	}, []);
	useEffect(() => {
		// save text on localStorage
		localStorage.setItem("text", contents);
		// I don't know why but r tag is generated when code block is implemented.
		// So delete them all.
		const strangeR = document.querySelectorAll("r");
		strangeR.forEach((r) => r.remove());
		// Also class isn't applied to first line of code block.
		// I can't find out what is problem.
		// Thus i just add code to append class.
		const tbodys = document.querySelectorAll("tbody");
		tbodys.forEach((tbody) => {
			tbody.children[0].classList.add("hover:bg-blue-200");
		});
	}, [contents]);
	useEffect(() => {
		if (data?.success) {
			router.push(`/posts/${data.post.title}`);
		}
	});
	// make textarea can recognize tab key
	const enableTabKey = (event: KeyboardEvent<HTMLTextAreaElement>) => {
		if (event.key === "Tab") {
			event.preventDefault();
			let textArea = event.currentTarget;
			textArea.setRangeText(
				"	",
				textArea.selectionStart,
				textArea.selectionStart,
				"end"
			);
		}
	};
	// ????????? ?????? ?????? ????????? ??? ???????????? handler
	const onValid = async (data: FormValue) => {
		if (loading) return;
		if (data.titleImage && data.titleImage.length > 0) {
			const cloudflareRequest = await fetch(`/api/files`);
			const { uploadURL } = await cloudflareRequest.json();
			const form = new FormData();
			form.append(
				"file",
				titleImage[0],
				user.user?.username + "_" + data.title
			);
			// @ts-ignore
			const response = await fetch(uploadURL, {
				method: "POST",
				body: form,
			});
			const {
				result: { id },
			} = await response.json();
			console.log({ ...data, titleImage: id });
			writePost({ ...data, titleImage: id });
		} else {
			writePost({ ...data, titleImage: "" });
		}
	};
	return (
		<Layout>
			<form onSubmit={handleSubmit(onValid)} className="w-full my-8">
				<div className="w-full flex flex-col px-8 gap-6">
					<div className="border-2 flex rounded-md px-4 py-2 w-full">
						<label htmlFor="postTitle" className="">
							??????:
						</label>
						<input
							id="postTitle"
							className="flex-1 ml-2 outline-none"
							type="text"
							placeholder="????????? ??????????????????."
							{...register("title", { required: true })}
						/>
					</div>
					<div className="flex justify-between">
						<div className="flex gap-8 items-center">
							<div id="category" className="border-2 rounded-md px-2 py-2">
								<label htmlFor="category">????????????: </label>
								<input
									className="outline-none"
									{...register("category", { required: true })}
								></input>
							</div>
							<div className="border-2 rounded-md px-2 py-2">
								<label htmlFor="drafy">????????? : </label>
								<input id="draft" type="checkbox" {...register("draft")} />
							</div>
							<div className="border-2 flex rounded-md px-4 py-2">
								<label htmlFor="tag">??????: </label>
								<input
									id="tag"
									type="text"
									placeholder="????????? ??????????????????"
									className="outline-none pl-2"
									{...register("tags")}
								/>
							</div>
							<div className="w-8 h-8">
								<label htmlFor="uploadImage">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 512 512"
										width="100%"
										height="100%"
										fill="currentColor"
									>
										<path d="M448 80c8.8 0 16 7.2 16 16V415.8l-5-6.5-136-176c-4.5-5.9-11.6-9.3-19-9.3s-14.4 3.4-19 9.3L202 340.7l-30.5-42.7C167 291.7 159.8 288 152 288s-15 3.7-19.5 10.1l-80 112L48 416.3l0-.3V96c0-8.8 7.2-16 16-16H448zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm80 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z" />
									</svg>
								</label>
							</div>
							<input
								id="uploadImage"
								type="file"
								accept="image/*"
								className="w-0 h-0"
								{...register("titleImage")}
							/>
						</div>

						<div>
							<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
								{loading ? "????????????" : "????????? ??????"}
							</button>
						</div>
					</div>{" "}
					{heroImagePreview ? <img src={heroImagePreview} /> : null}
					<div className="flex gap-8">
						{/* We will write our contents here.*/}
						<textarea
							onKeyDown={enableTabKey}
							className="w-full text-blue-500 border-2 border-black rounded-2xl p-4"
							rows={35}
							onDrop={imageDrop}
							{...register("contents", { required: true })}
						></textarea>
						{/* We will render our contents here. */}
						<MarkdownRenderer text={contents} />
					</div>
				</div>
			</form>
		</Layout>
	);
}
