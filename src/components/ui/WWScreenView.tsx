import { PropsWithChildren } from "react"
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context"
import { useExtendedTheme } from "../../theme"
import { Keyboard, StyleSheet, TouchableWithoutFeedback } from "react-native"

export const WWScreenView = ({
	children,
	...props
}: PropsWithChildren<SafeAreaViewProps>) => {
	const { appPadding } = useExtendedTheme()

	return (
		<TouchableWithoutFeedback style={styles.view} onPress={Keyboard.dismiss}>
			<SafeAreaView style={[{ padding: appPadding }, styles.view, props.style]}>
				{children}
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	view: { flex: 1 },
})
