import deepmerge from "deepmerge"

import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import {
	CommandNames,
	StatusCommandValue,
	getCommandByName,
} from "../../ble/types"

export type DeviceConfiguration = {
	[key in CommandNames]: undefined | ConfigKey
}
export type ConfigKey = {
	value?: string | StatusCommandValue
	loaded?: boolean
	loading: boolean
	error?: string
}

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
			action: PayloadAction<{ id: string; data: string[] }>,
		) => {
			const { id, data } = action.payload
			const currentConfig = state[id] || {}

			data.forEach((configKey) => {
				const command = getCommandByName(configKey)

				if (!command) return

				const config = currentConfig[command.name]
				currentConfig[command.name] = {
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
