import { PropsWithChildren, useEffect, useState } from "react"

import {
	KeyboardAvoidingView,
	Platform,
	StyleProp,
	StyleSheet,
	ViewStyle,
} from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useExtendedTheme } from "../theme"

type Props = {
	style?: StyleProp<ViewStyle>
	extra?: number
}

export const CustomKeyboardAvoidingView = ({
	children,
	style,
	extra = 0,
}: PropsWithChildren<Props>) => {
	const insets = useSafeAreaInsets()
	const [bottomPadding, setBottomPadding] = useState(insets.bottom)
	const { spacing } = useExtendedTheme()

	useEffect(() => {
		setBottomPadding(insets.bottom + spacing)
	}, [insets.bottom, insets.top, spacing])

	return (
		<KeyboardAvoidingView
			style={[styles.view, style]}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={bottomPadding + extra}
		>
			{children}
		</KeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	view: {
		flex: 1,
	},
})
