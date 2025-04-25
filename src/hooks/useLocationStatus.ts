import { useCallback } from "react"

import deviceInfoModule from "react-native-device-info"

import { useAppDispatch } from "../redux"
import {
	done,
	locationStatusError,
	start,
} from "../redux/slices/locationStatusSlice"
import { useInterval } from "./useInterval"

export const useLocationStatus = () => {
	const dispatch = useAppDispatch()

	const checkLocationService = useCallback(async () => {
		dispatch(start())
		try {
			const enabled = await deviceInfoModule.isLocationEnabled()
			dispatch(done(enabled))
		} catch (e: any) {
			dispatch(locationStatusError(e.message))
		}
	}, [dispatch])

	useInterval(
		() => {
			checkLocationService()
		},
		1000 * 3,
		true,
	)
}
