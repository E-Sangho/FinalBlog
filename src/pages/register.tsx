import useMutation from "@/libs/client/useMutation";
import { ResponseType } from "@/libs/server/withHandler";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface RegisterData {
	identifier: string;
	password: string;
	checkPassword: string;
	username: string;
	email?: string;
}

export default function Register() {
	const router = useRouter();
	const [enter, { loading, data, error }] =
		useMutation<ResponseType>("api/users/register");
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterData>({
		mode: "onChange",
	});
	useEffect(() => {
		if (data?.isAPISuccessful) {
			router.replace("/");
		}
	}, [data, router]);
	const onValid = (data: RegisterData) => {
		if (loading) return;
		enter(data);
	};
	return (
		<div className="w-full h-screen">
			<div className="w-96 mx-auto text-center mt-32 mb-8 text-2xl">
				회원가입
			</div>
			{data?.error ? (
				<div className="mx-auto text-center text-lg mb-8 text-red-500">
					{data?.error}
				</div>
			) : null}

			<div className="w-96 border-t border-l border-r border-b border-gray-200 rounded-lg px-6 py-6 mx-auto">
				<form onSubmit={handleSubmit(onValid)}>
					<div className="flex flex-col mb-4">
						<label htmlFor="identifier" className="mb-2">
							아이디
						</label>
						<input
							id="identifier"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							placeholder="아이디(6-12자 이내)"
							{...register("identifier", {
								required: "아이디는 필수 응답 항목입니다.",
								minLength: {
									value: 6,
									message: "아이디는 최소 6자리 이상이어야 합니다..",
								},
								maxLength: {
									value: 12,
									message: "아이디는 최대 12자리까지만 가능합니다.",
								},
							})}
						></input>
						<span className="text-red-400 px-2 py-1">
							{errors?.identifier?.message}
						</span>
					</div>
					<div className="flex flex-col mb-4">
						<label htmlFor="password" className="mb-2">
							비밀번호
						</label>
						<input
							id="password"
							type="password"
							placeholder="비밀번호 (14자이상)"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							{...register("password", {
								required: "비밀번호는 필수 응답 항목입니다.",
								minLength: {
									value: 14,
									message: "비밀번호는 14자 이상이어야 합니다.",
								},
							})}
						></input>{" "}
						<span className="text-red-400 px-2 py-1">
							{errors?.password?.message}
						</span>
					</div>
					<div className="flex flex-col mb-4">
						<label htmlFor="checkPassword" className="mb-2">
							비밀번호 확인
						</label>
						<input
							id="checkPassword"
							type="password"
							placeholder="비밀번호 (14자이상)"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							{...register("checkPassword", {
								required: "비밀번호를 검증해주세요.",
								minLength: {
									value: 14,
									message: "비밀번호 검증은 최소 14자 이상이어야 합니다.",
								},
								validate: {
									differentPassword: (_, values) =>
										values.password === values.checkPassword ||
										"비밀번호가 서로 다릅니다.",
								},
							})}
						></input>
						<span className="text-red-400 px-2 py-1">
							{errors?.checkPassword?.message}
						</span>
					</div>
					<div className="flex flex-col mb-4">
						<label htmlFor="username" className="mb-2">
							사용자명
						</label>
						<input
							id="username"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							{...register("username", {
								required: "사용자명은 필수 입력 항목입니다.",
								minLength: {
									value: 4,
									message: "사용자명은 4글자 이상이어야 합니다.",
								},
								maxLength: {
									value: 16,
									message: "사용자명은 16글자 이하여야 합니다..",
								},
							})}
						></input>
						<span className="text-red-400 px-2 py-1">
							{errors?.username?.message}
						</span>
					</div>
					<div className="flex flex-col mb-4">
						<label htmlFor="email" className="mb-2">
							이메일
						</label>
						<input
							id="email"
							type="email"
							className="px-2 py-2 flex-1 rounded-lg border border-gray-300 focus:outline-green-500 text-black"
							{...register("email", {
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i,
									message: "이메일 형식이 아닙니다.",
								},
							})}
						></input>
						<span className="text-red-400 px-2 py-1">
							{errors?.email?.message}
						</span>
					</div>
					<div className="mt-8">
						<button className="w-full bg-green-500 py-4 rounded-lg text-white">
							가입하기
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
