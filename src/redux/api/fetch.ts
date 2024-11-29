import { fetchBaseQuery } from "@reduxjs/toolkit/query"
import { RootState } from ".."
import Config from "react-native-config"

export const extendedBaseQuery = fetchBaseQuery({
	baseUrl: Config.API_BASE,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).authentication.auth?.accessToken

		// If we have a token set in state, let's assume that we should be passing it.
		if (token) {
			headers.set("Authorization", `Bearer ${token}`)
		}

		headers.set("Content-type", "application/json")

		return headers
	},
})
