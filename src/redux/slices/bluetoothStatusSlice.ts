import { BluetoothState } from "react-native-bluetooth-state-manager"

import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface BluetoothStatusState {
	status: BluetoothState
	initialLoad: boolean
}

const initialState: BluetoothStatusState = {
	status: "Unknown",
	initialLoad: true,
}

export const bluetoothStatusSlice = createSlice({
	name: "bluetoothStatus",
	initialState: initialState,
	reducers: {
		blStatusChanged: (state, action: PayloadAction<BluetoothState>) => {
			state.initialLoad = false
			state.status = action.payload
		},
	},
})

export const { blStatusChanged } = bluetoothStatusSlice.actions

export default bluetoothStatusSlice.reducer
