import { StyleProp, StyleSheet, View, ViewStyle } from "react-native"
import LoaderKit from "react-native-loader-kit"

type Props = {
	style?: StyleProp<ViewStyle>
	name?: string
	color?: string
}

export const WWLoader = ({
	style,
	name = "BallSpinFadeLoader",
	color = "#fff",
}: Props) => {
	return (
		<View style={[styles.container, style]}>
			<LoaderKit style={styles.defaultLoader} name={name} color={color} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	defaultLoader: {
		width: 50,
		height: 50,
	},
})
