import Layout from "@/components/layout";
import { marked } from "marked";
import prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-typescript";
import { ChangeEventHandler, KeyboardEvent, useEffect, useState } from "react";

export default function writePost() {
	const [text, setText] = useState<string>("");
	const sampleText =
		'```typescript\n// index.ts\nfor(int i = 0; i < 10; ++i) {\n	console.log("a");\n}\n```\n# Title\n## Sub-Title \n### Deeper title \n \n Paragraphs are separated\n by an empty line.\n\n Leave two spaces at the end of a line\n to go to the line.\n\n Attributs: *italic*, **bold**, \n`monospace`, ~~striped~~.\n\n List:\n\n * apples\n * oranges\n * pears\n\n Numbered list:\n\n 1. tofu\n 2. mushrooms\n 3. bread\n\n Link with placeholder text: *[Medium](https://www.medium.com)* \n\n Simple link: https://www.medium.com/ \n\n Code: ```\n console.log("Hello folks! I hoped you enjoyed this quick tutorial. Thanks for reading."); \n``` ';
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
	const renderer = new marked.Renderer();
	renderer.heading = (text: string, level: number) => {
		const escapedText = text.toLowerCase().replace(/[^\w]+/g, "-");
		let fontSize;
		if (level === 1) {
			fontSize = "text-4xl";
		}
		if (level === 2) {
			fontSize = "text-2xl";
		}
		if (level === 3) {
			fontSize = "text-xl";
		}

		if (level === 4) {
			fontSize = "text-lg";
		}

		if (level === 5) {
			fontSize = "text-sm";
		}

		if (level === 6) {
			fontSize = "text-xs";
		}
		return `
			<a name="${escapedText}"href="#${escapedText}">
				<h${level} class="${fontSize}">
					${text}
				</h${level}>
			</a>
		`;
	};
	renderer.code = (
		code: string,
		language: string | undefined,
		isEscaped: boolean
	) => {
		let langClass = `language-unknown`;
		if (language && renderer?.options?.highlight) {
			code = renderer.options.highlight(code, language as string) as string;
			langClass = `language-${language}`;
		}
		const line = code
			.replace("	", "\t")
			.split("\n")
			.map((item, index) => {
				if (index % 2 === 1) {
					return `
						<tr class="bg-slate-100 hover:bg-blue-200">
							<td class="inline pl-2 text-right border-r-2 pr-2 border-r-slate-300 select-none">${
								index + 1
							}</td>
							<td class="pl-2 w-full code-line">${item}</td>
						</tr>	
					`;
				}
				return `
					<tr class="hover:bg-blue-200">
						<td class="inline pl-2 text-right border-r-2 pr-2 border-r-slate-300 select-none">${
							index + 1
						}</td>
						<td class="pl-2 w-full code-line">${item}</td>
					</tr>	
				`;
			})
			.join("\n")
			.replace(/t|\\n/, "");
		return `
			<div class="codeBlock w-full rounded-lg overflow-hidden my-8">
				<div class="flex justify-between px-2 py-1 bg-lime-500 text-zinc-100">
					<p>${language?.toUpperCase()}</p>
				</div>
				<pre class="w-full h-full -mt-6 -mb-12">
					<code class="w-full h-full ${langClass}">
						<table class="-mt-6 -mb-6 w-full h-full box-border">
							<tbody class="bg-slate-50">
								${line}
							</tbody>
						</table>
					</code>
				</pre>
			</div>
			`;
	};
	// blockquote(quote: string) {},
	// list(body: string, ordered: boolean, start: number) {

	// },
	// listitem(text: string, task: boolean, checked: boolean) {

	// },
	// paragraph(text: string) {
	// 	return `
	// 		<p class="text-green-500">
	// 			${text}
	// 		</p>
	// 	`;
	// },
	// strong(text: string) {

	// },
	// link(href: string | null, title: string | null, text: string) {

	// },
	// image(href: string | null, title: string | null, text: string) {

	// }
	marked.setOptions({
		breaks: true,
		highlight: (code, lang) => {
			if (prism.languages[lang]) {
				return prism.highlight(code, prism.languages[lang], lang);
			} else {
				return code;
			}
		},
	});
	marked.use({ renderer });
	const renderText = (text: string) => {
		const __html = marked(text);
		return { __html };
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
					<div className="w-full border-2 border-black rounded-2xl p-4 font-mabinogi">
						<div dangerouslySetInnerHTML={renderText(text)}></div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
