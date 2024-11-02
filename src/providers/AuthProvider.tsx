import { PropsWithChildren, useEffect } from "react"
import { AuthorizeResult } from "react-native-app-auth"
import { useAppDispatch, useAppSelector } from "../redux"
import {
	authStart,
	authDone,
	AUTH_STORAGE_KEY,
} from "../redux/slices/authSlice"
import { getStorageData } from "../utils/helpers"

export const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
	const dispatch = useAppDispatch()
	const { auth } = useAppSelector((state) => state.authentication)

	useEffect(() => {
		const init = async () => {
			dispatch(authStart())
			dispatch(
				authDone(await getStorageData<AuthorizeResult>(AUTH_STORAGE_KEY)),
			)
		}

		if (!auth?.accessToken) {
			init()
		}
	}, [dispatch, auth])

	return children
}
