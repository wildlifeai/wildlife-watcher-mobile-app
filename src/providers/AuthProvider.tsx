import { PropsWithChildren, useEffect } from "react"
import { useAppDispatch } from "../redux"
import { AUTH_STORAGE_KEY, setInitialState } from "../redux/slices/authSlice"
import { getStorageData } from "../utils/helpers"
import { AuthResponse } from "../redux/api/auth/types"

export const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
	const dispatch = useAppDispatch()

	useEffect(() => {
		const init = async () => {
			const authData = await getStorageData<AuthResponse>(AUTH_STORAGE_KEY)
			dispatch(setInitialState(authData))
		}

		init()
	}, [dispatch])

	return children
}
