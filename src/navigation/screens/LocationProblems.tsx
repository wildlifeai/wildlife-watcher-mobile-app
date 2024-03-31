import { StyleSheet, Text, View } from "react-native"

export const LocationProblems = () => {
	return (
		<View style={styles.view}>
			<Text>Please enable location.</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	view: { flex: 1, alignItems: "center", justifyContent: "center" },
	icon: { marginBottom: 5 },
})
