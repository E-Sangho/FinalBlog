import Layout from "@/components/layout";
import { ChangeEventHandler, KeyboardEvent, useEffect, useState } from "react";
import { sample } from "@/util/mdSample";
import MarkdownRenderer from "@/components/markdownRenderer";

export default function writePost() {
	const [text, setText] = useState<string>("");
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
	return (
		<Layout>
			<div className="w-full my-8">
				<div className="w-full flex px-8 gap-8">
					{/* We will write our contents here.*/}
					<textarea
						onKeyDown={enableTabKey}
						onChange={textareasChange}
						className="w-full text-blue-500 border-2 border-black rounded-2xl p-4"
						rows={35}
					></textarea>
					{/* We will render our contents here. */}
					<MarkdownRenderer text={text} />
				</div>
			</div>
		</Layout>
	);
}
