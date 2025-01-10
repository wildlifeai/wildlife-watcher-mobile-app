import { PropsWithChildren } from "react"
import {
	Keyboard,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
} from "react-native"
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context"
import { useExtendedTheme } from "../../theme"

export const WWScreenView = ({
	children,
	...props
}: PropsWithChildren<SafeAreaViewProps>) => {
	const { appPadding } = useExtendedTheme()

	return (
		<TouchableWithoutFeedback style={styles.view} onPress={Keyboard.dismiss}>
			<SafeAreaView style={[{ padding: appPadding }, styles.view, props.style]}>
				<ScrollView
					style={styles.scrollView}
					contentContainerStyle={styles.scrollContent}
					keyboardShouldPersistTaps="handled"
				>
					{children}
				</ScrollView>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	)
}

const styles = StyleSheet.create({
	view: { flex: 1 },
	scrollView: {
		flex: 1,
	},
	scrollContent: {
		flexGrow: 1,
	},
})
