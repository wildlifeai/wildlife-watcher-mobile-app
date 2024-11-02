import { StyleSheet, View } from "react-native"
import { Button } from "react-native-paper"
import { useAppNavigation } from "../hooks/useAppNavigation"
import { useExtendedTheme } from "../theme"
import { Dispatch } from "react"
import { useAppDispatch } from "../redux"
import { logout } from "../redux/slices/authSlice"

type Props = {
	drawerControls: Dispatch<React.SetStateAction<boolean>>
}

export const SideNavigation = ({ drawerControls }: Props) => {
	const navigation = useAppNavigation()
	const dispatch = useAppDispatch()
	const { spacing, colors, appPadding } = useExtendedTheme()

	const goTo = (link: string) => {
		navigation.navigate(link)
		drawerControls(false)
	}

	const onLogout = () => {
		dispatch(logout())
		console.log("im here")
		drawerControls(false)
	}

	return (
		<View style={[styles.list, { marginVertical: appPadding }]}>
			<Button
				textColor={colors.onBackground}
				style={[{ margin: spacing }, styles.link]}
				icon="bell"
				onPress={() => goTo("Notifications")}
			>
				Notifications
			</Button>
			<Button
				textColor={colors.onBackground}
				style={[{ margin: spacing }, styles.link]}
				icon="account"
				onPress={() => goTo("Profile")}
			>
				Profile
			</Button>
			<Button
				textColor={colors.onBackground}
				style={[{ margin: spacing }, styles.link]}
				icon="cog"
				onPress={() => goTo("Settings")}
			>
				Settings
			</Button>
			<Button
				textColor={colors.onBackground}
				style={[{ margin: spacing }, styles.link]}
				icon="crowd"
				onPress={() => goTo("CommunityDiscussion")}
			>
				Community discussion
			</Button>
			<Button
				textColor={colors.onBackground}
				style={[{ margin: spacing }, styles.link]}
				icon="logout"
				onPress={onLogout}
			>
				Sign out
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	list: {
		flex: 1,
		alignItems: "flex-start",
	},
	link: {
		margin: 10,
	},
})
