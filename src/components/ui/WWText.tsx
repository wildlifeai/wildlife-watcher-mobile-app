import { PropsWithChildren } from "react"
import { TextStyle } from "react-native"
import { Text, TextProps } from "react-native-paper"
import { useExtendedTheme } from "../../theme"

type Props = TextProps<never> & {
	align?: TextStyle["textAlign"]
	gutter?: boolean
}

export const WWText = ({
	children,
	align,
	gutter,
	...props
}: PropsWithChildren<Props>) => {
	const { spacing } = useExtendedTheme()

	return (
		<Text
			{...props}
			style={[
				gutter && { marginBottom: spacing },
				align && { textAlign: align },
				props.style,
			]}
		>
			{children}
		</Text>
	)
}
