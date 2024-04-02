import {
	Dispatch,
	PropsWithChildren,
	createContext,
	useContext,
	useState,
} from "react"
import { StyleSheet, View } from "react-native"
import { Drawer } from "react-native-drawer-layout"
import { Avatar, Button, Surface } from "react-native-paper"
import { WWText } from "./ui/WWText"
import { useExtendedTheme } from "../theme"
import { useAuth } from "../providers/AuthProvider"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { getReadableVersion } from "react-native-device-info"

type DrawerContextProps = {
	isOpen: boolean
	setIsOpen: Dispatch<React.SetStateAction<boolean>>
}
const DrawerContext = createContext({} as DrawerContextProps)

export const useAppDrawer = () => useContext(DrawerContext)

export const AppDrawer = ({ children }: PropsWithChildren<unknown>) => {
	const [isOpen, setIsOpen] = useState(false)
	const { appPadding, spacing } = useExtendedTheme()
	const { setIsLoggedIn, isLoggedIn } = useAuth()
	const { top } = useSafeAreaInsets()

	const onLogout = () => {
		setIsLoggedIn(false)
		setIsOpen(false)
	}

	return (
		<Drawer
			swipeEnabled={isLoggedIn}
			open={isOpen}
			onOpen={() => setIsOpen(true)}
			onClose={() => setIsOpen(false)}
			drawerStyle={styles.view}
			renderDrawerContent={() => {
				return (
					<Surface
						style={[
							{ padding: appPadding, paddingTop: appPadding + top },
							styles.view,
						]}
					>
						<Avatar.Image source={require("../assets/avatar.png")} />
						<WWText variant="bodyLarge">I'm empty at the moment.</WWText>
						<Button icon="logout" onPress={onLogout}>
							Logout
						</Button>
						<View style={styles.version}>
							<WWText>Current version:</WWText>
							<WWText style={[styles.versionText, { marginStart: spacing }]}>
								v{getReadableVersion()}
							</WWText>
						</View>
					</Surface>
				)
			}}
		>
			<DrawerContext.Provider value={{ isOpen, setIsOpen }}>
				{children}
			</DrawerContext.Provider>
		</Drawer>
	)
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		height: "auto",
	},
	test: {
		height: 500,
	},
	version: {
		flex: 1,
		flexDirection: "row",
		alignItems: "flex-end",
	},
	versionText: {
		fontWeight: "bold",
	},
})
