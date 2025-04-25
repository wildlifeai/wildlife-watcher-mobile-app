import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface LocationStatusState {
	locationEnabled: boolean
	loading: boolean
	initialLoad: boolean
	error?: string
}

const initialState: LocationStatusState = {
	locationEnabled: false,
	loading: true,
	initialLoad: true,
}

export const locationStatusSlice = createSlice({
	name: "locationStatus",
	initialState: initialState,
	reducers: {
		start: (state) => {
			state.loading = true
		},
		done: (state, action: PayloadAction<boolean>) => {
			state.loading = false
			state.locationEnabled = action.payload
			state.error = undefined
			state.initialLoad = false
		},
		locationStatusError: (state, action: PayloadAction<string>) => {
			state.loading = false
			state.error = action.payload
			state.initialLoad = false
		},
	},
})

export const { start, done, locationStatusError } = locationStatusSlice.actions

export default locationStatusSlice.reducer
