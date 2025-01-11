import { StyleSheet, View } from "react-native"
import { ActivityIndicator } from "react-native-paper"
import { useExtendedTheme } from "../../theme"

export const WWLoader = () => {
	const { colors } = useExtendedTheme()

	return (
		<View style={styles.container}>
			<ActivityIndicator size="large" color={colors.primary} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
})
