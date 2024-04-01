import { PropsWithChildren, useEffect } from "react"

import { StyleSheet, View } from "react-native"

import { useAndroidPermissions } from "../hooks/useAndroidPermissions"
import { useAppSelector } from "../redux"
import { NoAndroidPermissions } from "../navigation/screens/NoAndroidPermissions"
import BootSplash from "react-native-bootsplash"
import { ActivityIndicator } from "react-native-paper"
import { Stack } from "../navigation"
/**
 * We need to make sure permissions are checked and requested
 * before any part of the app starts to load.
 */
export const AndroidPermissionsProvider = ({
	children,
}: PropsWithChildren<{}>) => {
	useAndroidPermissions()

	const { initialLoad, permissionsGranted } = useAppSelector(
		(state) => state.androidPermissions,
	)

	useEffect(() => {
		const hideBootSplash = async () => {
			if (!initialLoad && !permissionsGranted && (await BootSplash.isVisible)) {
				BootSplash.hide({ fade: true })
			}
		}

		hideBootSplash()
	}, [permissionsGranted, initialLoad])

	if (initialLoad) {
		return (
			<View style={styles.loader}>
				<ActivityIndicator size={30} />
			</View>
		)
	}

	if (!permissionsGranted) {
		return (
			<Stack.Navigator initialRouteName="AndroidPermissions">
				<Stack.Screen
					name="AndroidPermissions"
					component={NoAndroidPermissions}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		)
	}

	return <>{children}</>
}

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 30,
	},
})
