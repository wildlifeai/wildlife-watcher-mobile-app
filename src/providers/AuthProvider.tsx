import { PropsWithChildren, createContext, useContext, useState } from "react"

type AuthContextType = {
	isLoggedIn: boolean | undefined
	setIsLoggedIn: (value: boolean) => void
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: PropsWithChildren<unknown>) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>()

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			{children}
		</AuthContext.Provider>
	)
}
