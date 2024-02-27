import deepmerge from "deepmerge"

import { PayloadAction, createSlice } from "@reduxjs/toolkit"

// TODO - Implement
type DeviceConfiguration = any
type ConfigKey = any

interface ConfigurationState {
	[x: string]: DeviceConfiguration
}

const initialState: ConfigurationState = {}

export const configurationSlice = createSlice({
	name: "configuration",
	initialState: initialState,
	reducers: {
		deviceConfigChanged: (
			state,
			action: PayloadAction<{
				id: string
				configuration: Partial<DeviceConfiguration>
			}>,
		) => {
			const { id, configuration } = action.payload
			state[id] = deepmerge(state[id] || {}, configuration, {
				arrayMerge: (_, sourceArray) => {
					return sourceArray
				},
			})
		},
		deviceConfigClear: (
			state,
			action: PayloadAction<{
				id: string
			}>,
		) => {
			const { id } = action.payload
			state[id] = {} as DeviceConfiguration
		},
		deviceConfigInitiated: (
			state,
			action: PayloadAction<{ id: string; data: ConfigKey[] }>,
		) => {
			const { id, data } = action.payload
			const currentConfig = state[id] || {}

			data.forEach((configKey) => {
				const config = currentConfig[configKey]
				currentConfig[configKey] = {
					...config,
					loading: true,
					error: undefined,
				}
			})

			state[id] = currentConfig
		},
	},
})

export const { deviceConfigChanged, deviceConfigInitiated, deviceConfigClear } =
	configurationSlice.actions

export default configurationSlice.reducer
