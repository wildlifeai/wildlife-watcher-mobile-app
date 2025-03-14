import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { storeDataToStorage } from "../../utils/helpers"
import { AuthResponse } from "../api/auth/types"

export const AUTH_STORAGE_KEY = "auth"

type AuthState = {
	token?: string
	user?: AuthResponse["user"]
	loading: boolean
	initialLoad: boolean
	error?: Error
}

const initialState: AuthState = {
	loading: false,
	initialLoad: true,
}

export const authSlice = createSlice({
	name: "authentication",
	initialState,
	reducers: {
		setCredentials: (state, action: PayloadAction<AuthResponse>) => {
			state.token = action.payload.jwt
			state.user = action.payload.user
			state.loading = false
			state.initialLoad = false
			storeDataToStorage(AUTH_STORAGE_KEY, action.payload)
		},
		logout: (state) => {
			state.token = undefined
			state.user = undefined
			state.loading = false
			state.initialLoad = false
			storeDataToStorage(AUTH_STORAGE_KEY, null)
		},
		setInitialState: (state, action: PayloadAction<AuthResponse | null>) => {
			if (action.payload) {
				state.token = action.payload.jwt
				state.user = action.payload.user
			}
			state.initialLoad = false
		},
	},
})

export const { setCredentials, logout, setInitialState } = authSlice.actions
export default authSlice.reducer
