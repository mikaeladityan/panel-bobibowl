import React from "react";
import { ApiError } from "./ApiError";
import { SetStateAction } from "jotai";
import { ErrorState } from "~/store";

export type ResponseError = {
	status: number;
	response: {
		data: {
			message: string;
			errors?: Array<{ path: string; message: string }>;
		};
	};
};
export function fetchError(error: ResponseError, setError: React.Dispatch<SetStateAction<ErrorState>>) {
	if (error instanceof ApiError) {
		// Set error ke state global
		if (error.status === 429) {
			// Tampilkan alert / toast
			setError({
				message: "Anda terlalu sering melakukan permintaan. Coba lagi setelah 15 menit.",
			});
			return;
		}
	} else {
		// Handle unexpected errors
		setError({
			message: error.response.data.message || "An unexpected error occurred. Please try again.",
			errors:
				error.response.data.errors?.map((err) => ({
					path: err.path,
					message: err.message,
				})) || [],
		});
	}
}
