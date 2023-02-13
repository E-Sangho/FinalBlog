import { sample } from "@/util/mdSample";
import { marked } from "marked";
import prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-typescript";
import { useEffect } from "react";

interface MarkdownRendererProps {
	text: string;
}

export default function MarkdownRenderer({ text }: MarkdownRendererProps) {
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
	renderer.code = (code: string, language: string | undefined) => {
		let langClass = `language-unknown`;
		if (language && renderer?.options?.highlight) {
			code = renderer.options.highlight(code, language as string) as string;
			langClass = `language-${language}`;
		}
		const line = code
			.split("\n")
			.map((item, index) => {
				if (index % 2 === 1) {
					return `<tr class="bg-slate-100 hover:bg-blue-200">
							<td class="inline pl-2 text-right border-r-2 pr-2 border-r-slate-300 select-none">${
								index + 1
							}</td>
							<td class="pl-2 w-full code-line">${item}</td>
						</tr>`;
				}
				return `<tr class="hover:bg-blue-200">
						<td class="inline pl-2 text-right border-r-2 pr-2 border-r-slate-300 select-none">${
							index + 1
						}</td>
						<td class="pl-2 w-full code-line">${item}</td>
					</tr>`;
			})
			.join("\n")
			.replace(/\t|\\n/, "");
		return `
			<div class="codeBlock w-full rounded-lg overflow-hidden my-8 shadow-lg">
				<div class="flex justify-between px-2 py-1 bg-lime-500 text-zinc-100">
					<p>${language?.toUpperCase()}</p>
					<button class="copyButton">Copy code</button>
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
	renderer.hr = () => {
		return `
			<hr class="border-dashed border-2 my-8">
			</hr>
		`;
	};
	renderer.strong = (text: string) => {
		return `
			<strong class="text-red-400">
				${text}
			</strong>
		`;
	};
	renderer.list = (body: string, ordered: boolean, start: number) => {
		if (ordered) {
			return `
				<ol class="list-decimal ml-4">
					${body}
				</ol>	
			`;
		}
		return `
			<ul class="list-disc ml-4">
				${body}
			</ul>	
		`;
	};
	renderer.listitem = (text: string, tast: boolean, checked: boolean) => {
		return `
			<li class="">
				${text}
			</li>
		`;
	};
	renderer.paragraph = (text: string) => {
		return `
			<p class="text-base">
				${text}
			</p>
		`;
	};
	renderer.blockquote = (quote: string) => {
		return `
			<blockquote class="rounded-lg overflow-hidden shadow-lg border-l-8 border-purple-500 my-8">
				<div class="flex items-center text-purple-500 bg-purple-100 py-1">
						<div class="w-8 h-8 pb-1">
							<svg
							xmlns="http://www.w3.org/2000/svg"
							width="100%"
							height="100%"
							viewBox="0 0 128 512"
							fill="currentColor"
						>
							<path d="M72 64c0-17.7-14.3-32-32-32S8 46.3 8 64V320c0 17.7 14.3 32 32 32s32-14.3 32-32V64zM40 480a40 40 0 1 0 0-80 40 40 0 1 0 0 80z" />
						</svg>
					</div>
					<div class="text-2xl align-bottom">
						Remark	
					</div>
				</div>
				<div class="py-8 px-4">
					${quote}
				</div>
			</blockquote>
		`;
	};
	renderer.codespan = (code: string) => {
		return `
			<code class="text-orange-500 bg-slate-100 rounded px-1">
				${code}
			</code>
		`;
	};
	renderer.table = (header: string, body: string) => {
		return `
			<table class="w-full my-8 shadow-lg rounded-md overflow-hidden">
				<thead class="bg-red-500 py-4 text-lg text-gray-100">
					${header}
				</thead>
				<tbody class="even:bg-red-100">
					${body}
				</tbody>
			</table>
		`;
	};
	renderer.tablerow = (content: string) => {
		return `
			<tr class="even:bg-red-200">
				${content}
			</tr>
		`;
	};
	renderer.tablecell = (content: string, flags: object) => {
		return `
			<th class="px-2 py-2">
				${content}
			</th>
		`;
	};
	renderer.link = (href: string, title: string, text: string) => {
		return `
			<a href="${href}" class="text-indigo-500">
				${text}
			</a>
		`;
	};
	renderer.image = (href: string, title: string, text: string) => {
		return `
			<image src="${href}" class="mx-auto">
			</image>
		`;
	};
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
	// create "Copy Code" button at the codeblocks
	useEffect(() => {
		let copyButtons = document.querySelectorAll(".copyButton");
		copyButtons.forEach((copyButton) => {
			copyButton.addEventListener(
				"click",
				async () => await copyCode(copyButton)
			);
		});
	});
	const copyCode = async (dom: Element) => {
		const code = dom.parentElement?.parentElement?.querySelector("code");
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
	return (
		<div className="w-full border-2 border-black rounded-2xl p-4 font-mabinogi">
			<div dangerouslySetInnerHTML={renderText(text)}></div>
		</div>
	);
}
