import { api } from ".."
import { AuthResponse, LoginRequest, RegisterRequest } from "./types"
import { API_URLS } from "../urls"

export const authApi = api.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation<AuthResponse, LoginRequest>({
			query: (credentials) => ({
				url: API_URLS.AUTH_LOGIN,
				method: "POST",
				body: credentials,
			}),
		}),
		register: builder.mutation<AuthResponse, RegisterRequest>({
			query: (credentials) => ({
				url: API_URLS.AUTH_REGISTER,
				method: "POST",
				body: credentials,
			}),
		}),
	}),
	overrideExisting: false,
})

export const { useLoginMutation, useRegisterMutation } = authApi
