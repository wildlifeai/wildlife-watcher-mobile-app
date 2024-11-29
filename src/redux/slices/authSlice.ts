import {
	PayloadAction,
	createAsyncThunk,
	createSlice,
	isAnyOf,
} from "@reduxjs/toolkit"
import { authorize, AuthorizeResult, revoke } from "react-native-app-auth"
import { storeDataToStorage } from "../../utils/helpers"
import { RootState } from ".."

const TENANT_ID = "56bdb921-ae1e-4375-8bcd-2a978870cacb"
const CLIENT_ID = "bde3bf0d-0793-40e4-9fb1-e267d84cf766"
export const AUTH_STORAGE_KEY = "auth"

const config = {
	issuer: `https://login.microsoftonline.com/${TENANT_ID}/v2.0`,
	clientId: CLIENT_ID,
	redirectUrl: "com.wildlife.auth://callback/",
	scopes: ["openid", "profile", "email"],
	// serviceConfiguration: {
	// 	authorizationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize`,
	// 	tokenEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
	// 	revocationEndpoint: `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout`,
	// },
}

interface ScanningState {
	loading: boolean
	initialLoad: boolean
	error?: Error
	auth?: AuthorizeResult
}

const initialState: ScanningState = {
	loading: false,
	initialLoad: true,
}

export const login = createAsyncThunk("authentication/login", async () => {
	const authData = await authorize(config)
	await storeDataToStorage(AUTH_STORAGE_KEY, authData)

	return authData
})

export const logout = createAsyncThunk(
	"authentication/logout",
	async (_, { getState }) => {
		const {
			authentication: { auth },
		} = getState() as RootState

		try {
			await revoke(config, {
				tokenToRevoke: `${auth?.accessToken}`,
				includeBasicAuth: true,
				sendClientId: true,
			})
		} catch (e: any) {
			console.log(e?.message)
		}

		await storeDataToStorage(AUTH_STORAGE_KEY, null)
	},
)

export const authSlice = createSlice({
	name: "authentication",
	initialState: initialState,
	reducers: {
		authStart: (state) => {
			state.loading = true
			state.error = undefined
		},
		authDone: (state, action: PayloadAction<AuthorizeResult | undefined>) => {
			state.loading = false
			state.initialLoad = false
			state.auth = action.payload
		},
		authError: (state, action: PayloadAction<Error>) => {
			state.error = action.payload
			state.loading = false
			state.initialLoad = false
		},
	},
	extraReducers: (builder) => {
		builder.addCase(login.fulfilled, (state, { payload }) => {
			state.loading = false
			state.initialLoad = false
			state.auth = payload
		})
		builder.addCase(logout.fulfilled, (state) => {
			state.loading = false
			state.initialLoad = false
			state.auth = undefined
		})
		builder.addMatcher(isAnyOf(login.pending, logout.pending), (state) => {
			state.loading = true
			state.error = undefined
		})
		builder.addMatcher(
			isAnyOf(login.rejected, logout.rejected),
			(state, { payload }) => {
				state.error = payload as Error
				state.loading = false
				state.initialLoad = false
			},
		)
	},
})

export const { authStart, authDone, authError } = authSlice.actions

export default authSlice.reducer
