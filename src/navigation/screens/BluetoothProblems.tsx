import * as React from "react"

import { StyleSheet, Text, View } from "react-native"

export const BluetoothProblems = () => {
	return (
		<View style={styles.view}>
			<Text>Please enable bluetooth.</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	view: { flex: 1, alignItems: "center", justifyContent: "center" },
	icon: { marginBottom: 5 },
})
