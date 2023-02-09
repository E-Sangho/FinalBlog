import { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

interface LayoutProps {
	children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
	return (
		<div>
			<Header />
			<div className="">{children}</div>
			<Footer />
		</div>
	);
}
