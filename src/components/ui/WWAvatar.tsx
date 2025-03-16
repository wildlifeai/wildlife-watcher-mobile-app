import {
	StyleProp,
	StyleSheet,
	TouchableOpacity,
	ViewStyle,
} from "react-native"
import { Avatar } from "react-native-paper"

type Props = {
	size?: number
	style?: StyleProp<ViewStyle>
	onPress?: () => void
}

export const WWAvatar = ({ size = 40, style, onPress }: Props) => {
	const avatar = (
		<Avatar.Image
			style={[styles.avatar, style]}
			size={size}
			source={require("../../assets/avatar.png")}
		/>
	)

	if (onPress) {
		return <TouchableOpacity onPress={onPress}>{avatar}</TouchableOpacity>
	}

	return avatar
}

const styles = StyleSheet.create({
	avatar: {
		marginEnd: 6,
	},
})
