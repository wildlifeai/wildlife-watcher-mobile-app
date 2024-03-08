import { useEffect } from "react"

import { useAppDispatch } from "../redux"
import {
	permissionCheck,
	permissionRequest,
} from "../redux/slices/androidPermissionsSlice"
import { useInterval } from "./useInterval"

export const useAndroidPermissions = () => {
	const dispatch = useAppDispatch()

	useInterval(
		() => {
			dispatch(permissionCheck())
		},
		1000 * 10,
		true,
	)

	useEffect(() => {
		dispatch(permissionRequest())
	}, [dispatch])
}
