import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Appbar } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { useAppDrawer } from "./AppDrawer"
import { useExtendedTheme } from "../theme"
import { WWAvatar } from "./ui/WWAvatar"

export const NavigationBar = ({
	navigation,
	route,
	options,
	back,
}: NativeStackHeaderProps) => {
	const title = getHeaderTitle(options, route.name)
	const { isOpen, setIsOpen } = useAppDrawer()
	const {
		colors: { onBackground },
	} = useExtendedTheme()

	return (
		<Appbar.Header mode="center-aligned">
			{back ? (
				<Appbar.BackAction
					iconColor={onBackground}
					onPress={navigation.goBack}
				/>
			) : (
				<Appbar.Action
					iconColor={onBackground}
					icon={isOpen ? "backburger" : "forwardburger"}
					onPress={() => setIsOpen(isOpen ? false : true)}
				/>
			)}
			{title && <Appbar.Content title={title} />}
			{!isOpen && <WWAvatar onPress={() => navigation.navigate("Profile")} />}
		</Appbar.Header>
	)
}
