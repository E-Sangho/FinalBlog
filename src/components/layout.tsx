import { ReactNode } from "react";
import Footer from "./footer";
import Header from "./header";

interface LayoutProps {
	children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
	return (
		<div className="min-h-screen flex flex-col">
			<Header />
			<div className="flex-1">{children}</div>
			<Footer />
		</div>
	);
}
