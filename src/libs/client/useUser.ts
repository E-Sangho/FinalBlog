import { User } from "@prisma/client";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useSWR from "swr";

interface ProfileResponse {
	isAPISuccessful: boolean;
	profile: User;
}

interface IUserUser {
	toLoginPage?: boolean;
}

interface LoginResponse {
	isLogin: boolean;
}

export default function useUser({ toLoginPage = true }: IUserUser) {
	const { data, error, mutate } = useSWR<ProfileResponse>(
		"/api/users/profile",
		{
			shouldRetryOnError: false,
		}
	);
	if (toLoginPage) {
		const router = useRouter();
		useEffect(() => {
			if (data && !data.isAPISuccessful) {
				router.replace("/login");
			}
		}, [data, router]);
	}
	return { user: data?.profile, isLoading: !data && !error, mutate };
}
