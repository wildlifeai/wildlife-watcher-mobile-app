import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Appbar } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { useAuth } from "../providers/AuthProvider"
import { useAppDrawer } from "./AppDrawer"

export const NavigationBar = ({
	navigation,
	route,
	options,
	back,
}: NativeStackHeaderProps) => {
	const title = getHeaderTitle(options, route.name)
	const { setIsLoggedIn } = useAuth()
	const { isOpen, setIsOpen } = useAppDrawer()

	return (
		<Appbar.Header mode="center-aligned">
			{back ? (
				<Appbar.BackAction onPress={navigation.goBack} />
			) : (
				<Appbar.Action
					icon={isOpen ? "backburger" : "forwardburger"}
					onPress={() => setIsOpen((prevState) => !prevState)}
				/>
			)}
			{title && <Appbar.Content title={title} />}
			{setIsLoggedIn && (
				<Appbar.Action icon="logout" onPress={() => setIsLoggedIn(false)} />
			)}
		</Appbar.Header>
	)
}
