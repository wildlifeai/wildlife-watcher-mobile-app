import * as React from "react"
import { PropsWithChildren, useEffect, useState } from "react"

import {
	KeyboardAvoidingView,
	Platform,
	StyleProp,
	ViewStyle,
} from "react-native"

import { useSafeAreaInsets } from "react-native-safe-area-context"

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

	useEffect(() => {
		setBottomPadding(insets.bottom)
	}, [insets.bottom, insets.top])

	return (
		<KeyboardAvoidingView
			style={style}
			behavior={Platform.OS === "ios" ? "padding" : undefined}
			keyboardVerticalOffset={bottomPadding + extra}
		>
			{children}
		</KeyboardAvoidingView>
	)
}
