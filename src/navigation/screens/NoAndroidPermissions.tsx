import * as React from "react"

import { Button, Linking, StyleSheet, Text, View } from "react-native"

import { useAppDispatch, useAppSelector } from "../../redux"
import { permissionRequest } from "../../redux/slices/androidPermissionsSlice"

export const NoAndroidPermissions = () => {
	const { error, neverAskAgain } = useAppSelector(
		(state) => state.androidPermissions,
	)
	const dispatch = useAppDispatch()

	const openSettings = () => {
		Linking.openSettings()
	}

	return (
		<View style={[styles.view]}>
			<View style={styles.text}>
				<Text style={styles.textCenter}>Grant permissions.</Text>
				{error && <Text>{error.message}</Text>}
			</View>
			<Button title="Retry" onPress={() => dispatch(permissionRequest())} />
			{neverAskAgain.length > 0 && (
				<>
					<View style={styles.neverAskAgain}>
						<Text style={styles.text}>Could not grant permissions.</Text>
						<Button onPress={openSettings} title="Open settings" />
					</View>
				</>
			)}
		</View>
	)
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
	},
	icon: { marginBottom: 5 },
	text: { marginBottom: 10, paddingHorizontal: 30, textAlign: "center" },
	textCenter: {
		textAlign: "center",
	},
	neverAskAgain: {
		paddingHorizontal: 30,
		alignItems: "center",
	},
	divider: {
		marginVertical: 10,
		alignSelf: "stretch",
	},
})
