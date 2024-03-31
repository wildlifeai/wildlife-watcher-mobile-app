import { PropsWithChildren, createContext, useEffect, useState } from "react"

type AuthContextType = {
	isLoggedIn: boolean | undefined
	setIsLoggedIn: (value: boolean) => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>()

	// Mock
	useEffect(() => {
		const t = setTimeout(() => {
			setIsLoggedIn(false)
		}, 2000)

		return () => {
			clearTimeout(t)
		}
	}, [])

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			{children}
		</AuthContext.Provider>
	)
}
