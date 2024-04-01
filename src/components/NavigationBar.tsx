import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import { Appbar, Avatar } from "react-native-paper"
import { getHeaderTitle } from "@react-navigation/elements"
import { useAppDrawer } from "./AppDrawer"
import { useExtendedTheme } from "../theme"
import { StyleSheet } from "react-native"

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
			{!isOpen && (
				<Avatar.Image
					style={styles.avatar}
					size={40}
					source={require("../assets/avatar.png")}
				/>
			)}
		</Appbar.Header>
	)
}

const styles = StyleSheet.create({
	avatar: {
		marginEnd: 6,
	},
})
