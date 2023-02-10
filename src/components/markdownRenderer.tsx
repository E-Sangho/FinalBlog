import { sample } from "@/util/mdSample";
import { marked } from "marked";
import prism from "prismjs";
import "prismjs/themes/prism.css";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-java";
import "prismjs/components/prism-typescript";

interface MarkdownRendererProps {
	text: string;
}

export default function MarkdownRenderer({ text }: MarkdownRendererProps) {
	const sampleText = sample;
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
	return (
		<div className="w-full border-2 border-black rounded-2xl p-4 font-mabinogi">
			<div dangerouslySetInnerHTML={renderText(text)}></div>
		</div>
	);
}
