import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Appbar } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { useContext } from "react"
import { AuthContext } from "../providers/AuthProvider"

export const NavigationBar = ({
	navigation,
	route,
	options,
	back,
}: NativeStackHeaderProps) => {
	const title = getHeaderTitle(options, route.name)
	const { setIsLoggedIn } = useContext(AuthContext)

	return (
		<Appbar.Header mode="center-aligned">
			{back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
			{title && <Appbar.Content title={title} />}
			{setIsLoggedIn && (
				<Appbar.Action icon="logout" onPress={() => setIsLoggedIn(false)} />
			)}
		</Appbar.Header>
	)
}
