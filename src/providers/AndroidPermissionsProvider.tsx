import * as React from "react"
import { PropsWithChildren } from "react"

import { ActivityIndicator, StyleSheet, Text, View } from "react-native"

import { useAndroidPermissions } from "../hooks/useAndroidPermissions"
import { useAppSelector } from "../redux"
import { NoAndroidPermissions } from "../navigation/screens/NoAndroidPermissions"

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

	if (initialLoad) {
		return (
			<View style={styles.loader}>
				<Text style={styles.title}>Device is getting ready...</Text>
				<ActivityIndicator size={30} />
			</View>
		)
	}

	if (!permissionsGranted) {
		return <NoAndroidPermissions />
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
	title: {
		marginBottom: 15,
	},
})
