import { PermissionStatus, PermissionsAndroid, Platform } from "react-native"

import { AppThunk } from ".."
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { log } from "../../utils/logger"

interface AndroidPermissionsState {
	permissionsGranted: boolean
	neverAskAgain: string[]
	loading: boolean
	initialLoad: boolean
	error?: Error
}

const initialState: AndroidPermissionsState = {
	permissionsGranted: false,
	neverAskAgain: [],
	loading: true,
	initialLoad: true,
}

const PERMISSIONS =
	(Platform.Version as number) >= 31
		? [
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
		  ]
		: [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION]

export const permissionCheck =
	(): AppThunk<Promise<void>> => async (dispatch) => {
		dispatch(start())

		if (Platform.OS === "android" && (Platform.Version as number) >= 23) {
			const promises = PERMISSIONS.map((permission) => {
				return PermissionsAndroid.check(permission)
			})

			return Promise.all(promises)
				.then((results) => {
					if (results.find((granted) => !granted) === false) {
						dispatch(done(false))
					} else {
						dispatch(done(true))
					}
				})
				.catch((e: any) => {
					log(e)
				})
		} else {
			dispatch(done(true))
		}
	}

export const permissionRequest =
	(): AppThunk<Promise<void>> => async (dispatch) => {
		if (Platform.OS === "ios") return

		dispatch({ type: "start" })

		PermissionsAndroid.requestMultiple(PERMISSIONS)
			.then((results) => {
				const anyLeft = Object.values(results).find((result) => {
					return result !== "granted"
				})

				if (anyLeft) {
					const neverAskAgain = []

					for (const key in results) {
						const value: PermissionStatus = results[key as keyof typeof results]
						if (value === "never_ask_again") {
							neverAskAgain.push(key)
						}
					}

					dispatch(neverAskPermissions(neverAskAgain))
					dispatch(done(false))
				} else {
					dispatch(neverAskPermissions([]))
					dispatch(done(true))
				}
			})
			.catch((e) => {
				dispatch(androidPermissionsError(e))
			})
	}

export const androidPermissionsSlice = createSlice({
	name: "androidPermissions",
	initialState: initialState,
	reducers: {
		start: (state) => {
			state.loading = true
		},
		done: (state, action: PayloadAction<boolean>) => {
			state.loading = false
			state.permissionsGranted = action.payload
			state.error = undefined
			state.initialLoad = false
		},
		androidPermissionsError: (state, action: PayloadAction<Error>) => {
			state.loading = false
			state.error = action.payload
			state.initialLoad = false
		},
		neverAskPermissions: (state, action: PayloadAction<string[]>) => {
			state.neverAskAgain = action.payload
		},
	},
})

export const { start, done, androidPermissionsError, neverAskPermissions } =
	androidPermissionsSlice.actions

export default androidPermissionsSlice.reducer
