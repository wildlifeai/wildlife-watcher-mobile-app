import { StyleProp, View, ViewStyle } from "react-native"
import { Icon } from "react-native-paper"
import { ThemeProp } from "react-native-paper/lib/typescript/types"

/**
 * Icon props are currently not exported from the
 * RN Paper library, I copied them from their source
 * code.
 *
 * Current react-native-paper version: 5.12.3
 *
 * Located in react-native-paper/src/components/Icon.tsx.
 *
 * Lines 21 + 64.
 */
type Props = {
	size: number
	allowFontScaling?: boolean
	source: any
	color?: string | undefined
	testID?: string | undefined
	theme?: ThemeProp | undefined
	containerStyle?: StyleProp<ViewStyle>
}

export const WWIcon = ({ containerStyle, ...props }: Props) => {
	return (
		<View style={containerStyle}>
			<Icon {...props} />
		</View>
	)
}
