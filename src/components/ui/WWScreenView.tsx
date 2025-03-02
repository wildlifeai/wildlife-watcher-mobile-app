import { PropsWithChildren } from "react"
import {
	Keyboard,
	ScrollView,
	StyleSheet,
	TouchableWithoutFeedback,
	View,
} from "react-native"
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context"
import { useExtendedTheme } from "../../theme"

type Props = PropsWithChildren<SafeAreaViewProps> & {
	scrollable?: boolean
}

export const WWScreenView = ({
	children,
	scrollable = true,
	...props
}: Props) => {
	const { appPadding } = useExtendedTheme()

	return (
		<TouchableWithoutFeedback style={styles.view} onPress={Keyboard.dismiss}>
			<SafeAreaView style={[{ padding: appPadding }, styles.view, props.style]}>
				{scrollable ? (
					<ScrollView
						style={styles.scrollView}
						contentContainerStyle={styles.scrollContent}
						keyboardShouldPersistTaps="handled"
					>
						{children}
					</ScrollView>
				) : (
					<View style={styles.view}>{children}</View>
				)}
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
