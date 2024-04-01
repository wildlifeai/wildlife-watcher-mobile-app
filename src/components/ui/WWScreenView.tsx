import { PropsWithChildren } from "react"
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context"
import { useExtendedTheme } from "../../theme"

export const WWScreenView = ({
	children,
	...props
}: PropsWithChildren<SafeAreaViewProps>) => {
	const { padding } = useExtendedTheme()

	return (
		<SafeAreaView style={[{ padding }, props.style]}>{children}</SafeAreaView>
	)
}
