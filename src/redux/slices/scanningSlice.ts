import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface ScanningState {
	isScanning: boolean
	error?: Error
}

const initialState: ScanningState = {
	isScanning: false,
}

export const scanningSlice = createSlice({
	name: "scanning",
	initialState: initialState,
	reducers: {
		scanStart: (state) => {
			state.isScanning = true
			state.error = undefined
		},
		scanStop: (state) => {
			state.isScanning = false
			state.error = undefined
		},
		scanError: (state, action: PayloadAction<Error>) => {
			state.error = action.payload
		},
	},
})

export const { scanStart, scanStop, scanError } = scanningSlice.actions

export default scanningSlice.reducer
