import { useState } from "react";

interface UseMutationOptions<T> {
	onSuccess?: () => void;
}

interface UseMutationState<T> {
	loading: boolean;
	data?: T;
	error?: object;
}

type UseMutationResult<T> = [(data: any) => void, UseMutationState<T>];

export default function useMutation<T = any>(
	url: string,
	options: UseMutationOptions<T> = {}
): UseMutationResult<T> {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState<undefined | any>(undefined);
	const [error, setError] = useState<undefined | any>(undefined);
	function mutation(data: any) {
		setLoading(true);
		fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})
			.then((response) => response.json())
			.then((data) => {
				setData(data);
				if (options.onSuccess) {
					options.onSuccess();
				}
			})
			.catch((error) => setError(error))
			.finally(() => setLoading(false));
	}
	return [mutation, { loading, data, error }];
}
