import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

import androidPermissionsReducer from "./slices/androidPermissionsSlice"
import bleLibraryReducer from "./slices/bleLibrarySlice"
import blStatusReducer from "./slices/bluetoothStatusSlice"
import configurationReducer from "./slices/configurationSlice"
import devicesReducer from "./slices/devicesSlice"
import locationStatusReducer from "./slices/locationStatusSlice"
import logsReducer from "./slices/logsSlice"
import scanningReducer from "./slices/scanningSlice"
import { Action, ThunkAction, configureStore } from "@reduxjs/toolkit"

const store = configureStore({
	reducer: {
		devices: devicesReducer,
		logs: logsReducer,
		configuration: configurationReducer,
		scanning: scanningReducer,
		bleLibrary: bleLibraryReducer,
		blStatus: blStatusReducer,
		locationStatus: locationStatusReducer,
		androidPermissions: androidPermissionsReducer,
	},
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export type AppThunk<ReturnType = void> = ThunkAction<
	ReturnType,
	RootState,
	unknown,
	Action
>
