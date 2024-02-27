import { useEffect } from "react"

import BleManager from "react-native-ble-manager"

import { log, logError } from "../utils/logger"
import { useAppDispatch, useAppSelector } from "../redux"
import { libError, libStarted } from "../redux/slices/bleLibrarySlice"

export const useSetupBLELibrary = () => {
	const { initialized, initialLoad, error } = useAppSelector(
		(state) => state.bleLibrary,
	)
	const dispatch = useAppDispatch()

	useEffect(() => {
		if (initialized) return

		BleManager.start({ showAlert: false })
			.then(() => {
				log("BLE library initialized")
				dispatch(libStarted())
			})
			.catch((e) => {
				logError(e)
				dispatch(libError(e))
			})
	}, [dispatch, initialized])

	return {
		initialized,
		initialLoad,
		error,
	}
}
