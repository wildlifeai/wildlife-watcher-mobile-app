import { PayloadAction, createSlice } from "@reduxjs/toolkit"

interface LogsState {
	[x: string]: string
}

const initialState: LogsState = {}

// export const thunkSendMessage =
// 	(): AppThunk<Promise<LogsState>> => async (dispatch, getState) => {
// 		dispatch(increment())
// 		return getState().logs
// 	}

export const logsSlice = createSlice({
	name: "logs",
	initialState: initialState,
	reducers: {
		deviceLogChange: (
			state,
			action: PayloadAction<{ id: string; log: string }>,
		) => {
			const { id, log } = action.payload
			state[id] = log
		},
	},
})

export const { deviceLogChange } = logsSlice.actions

export default logsSlice.reducer
