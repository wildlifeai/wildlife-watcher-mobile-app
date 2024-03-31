import { StyleSheet, Text, View } from "react-native"

export const BleProblems = () => {
	return (
		<View style={styles.view}>
			<Text>BLE library could not start.</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		paddingHorizontal: 30,
	},
})
