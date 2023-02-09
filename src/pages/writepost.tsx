import Layout from "@/components/layout";
import { marked } from "marked";
import { ChangeEventHandler, useEffect, useState } from "react";

export default function writePost() {
	const [text, setText] = useState<string>("");
	const sampleText =
		'# Title\n## Sub-Title \n### Deeper title \n \n Paragraphs are separated\n by an empty line.\n\n Leave two spaces at the end of a line\n to go to the line.\n\n Attributs: *italic*, **bold**, \n`monospace`, ~~striped~~.\n\n List:\n\n * apples\n * oranges\n * pears\n\n Numbered list:\n\n 1. tofu\n 2. mushrooms\n 3. bread\n\n Link with placeholder text: *[Medium](https://www.medium.com)* \n\n Simple link: https://www.medium.com/ \n\n Code: ```\n console.log("Hello folks! I hoped you enjoyed this quick tutorial. Thanks for reading."); \n``` ';
	const textareasChange: ChangeEventHandler<HTMLTextAreaElement> = (event) => {
		setText(event.target.value);
	};
	const renderText = (text: string) => {
		const __html = marked(text);
		return { __html };
	};
	useEffect(() => {
		const savedText = localStorage.getItem("text");
		if (savedText) {
			setText(savedText);
		} else {
			setText(sampleText);
		}
	}, []);
	useEffect(() => {
		localStorage.setItem("text", text);
	}, [text]);
	return (
		<Layout>
			<div className="w-full">
				<div className="w-full">
					{/* We will write our contents here.*/}
					<textarea
						onChange={textareasChange}
						className="w-full text-blue-500"
						rows={35}
					></textarea>
					{/* We will render our contents here. */}
					<div className="text-red-500">
						<div dangerouslySetInnerHTML={renderText(text)}></div>
					</div>
				</div>
			</div>
		</Layout>
	);
}
