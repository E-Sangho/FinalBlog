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

export default function writePost() {
	const [text, setText] = useState<string>("");
	const [images, setImages] = useState<string[]>([]);
	const sampleText = sample;
	const textareasChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
		setText(event.target.value);
	};
	// create "Copy Code" button at the codeblocks
	const copyCode = async (dom: Element) => {
		const code = dom.querySelector("code");
		const codeLines: NodeListOf<HTMLElement> | undefined =
			code?.querySelectorAll(".code-line");
		// const text = code ? code.innerText : "";
		let text = "";
		codeLines?.forEach((codeLine) => {
			text += codeLine.innerText;
			text += "\n";
		});
		await navigator.clipboard.writeText(text);
	};
	// image drop event
	const imageDrop: DragEventHandler<HTMLTextAreaElement> = (event) => {
		event.preventDefault();
		let data = event.dataTransfer;
		let files = data.files;
		const url = URL.createObjectURL(files[0]);
		const image = `\n<img src="${url}" />`;
		setText((text) => text + image);
		setImages((prev) => [...prev, url]);
	};
	useEffect(() => {
		// When page loaded get text from localStorage and apply it.
		const savedText = localStorage.getItem("text");
		if (savedText) {
			setText(savedText);
		} else {
			setText(sampleText);
		}
	}, []);
	useEffect(() => {
		// save text on localStorage
		localStorage.setItem("text", text);
		// Create Code Copy button
		const blocks = document.querySelectorAll(".codeBlock");
		blocks.forEach((block) => {
			if (navigator.clipboard) {
				let button = document.createElement("button");
				button.innerText = "Copy Code";
				block.children[0].appendChild(button);

				button.addEventListener("click", async () => {
					await copyCode(block);
				});
			}
		});
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
	}, [text]);
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
	// 포스트 작성 버튼 눌렀을 때 작동하는 handler
	const postSubmit: MouseEventHandler<HTMLInputElement> = (event) => {
		event.preventDefault();
	};
	return (
		<Layout>
			<div className="w-full my-8">
				<div className="w-full flex flex-col px-8 gap-6">
					<div className="border-2 flex rounded-md px-4 py-2 w-full">
						<label htmlFor="postTitle" className="">
							제목:
						</label>
						<input
							id="postTitle"
							className="flex-1 ml-2 outline-none"
							type="text"
							placeholder="제목을 입력해주세요."
						/>
					</div>
					<div className="flex justify-between">
						<div className="flex gap-8 items-center">
							<div className="border-2 rounded-md px-2 py-2">
								<select className="outline-none">
									<option value="Java">Java</option>
									<option value="JavaScript">JavaScript</option>
								</select>
							</div>
							<div className="border-2 rounded-md px-2 py-2">
								<label htmlFor="drafy">비공개 : </label>
								<input id="draft" type="checkbox" />
							</div>
							<div className="border-2 flex rounded-md px-4 py-2">
								<label htmlFor="tag">태그: </label>
								<input
									id="tag"
									type="text"
									placeholder="태그를 입력해주세요"
									className="outline-none pl-2"
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
							/>
						</div>
						<div>
							<input
								type="button"
								className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
								value="포스트 작성"
								onClick={postSubmit}
							></input>
						</div>
					</div>
					<div className="flex gap-8">
						{/* We will write our contents here.*/}
						<textarea
							onKeyDown={enableTabKey}
							onChange={textareasChange}
							className="w-full text-blue-500 border-2 border-black rounded-2xl p-4"
							rows={35}
							onDrop={imageDrop}
							value={text}
						></textarea>
						{/* We will render our contents here. */}
						<MarkdownRenderer text={text} />
					</div>
				</div>
			</div>
		</Layout>
	);
}
