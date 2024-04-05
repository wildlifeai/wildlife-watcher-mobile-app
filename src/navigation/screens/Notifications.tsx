import { View } from "react-native"
import { WWScreenView } from "../../components/ui/WWScreenView"
import { WWText } from "../../components/ui/WWText"

export const Notifications = () => {
	return (
		<WWScreenView>
			<View>
				<WWText variant="titleSmall">Notifications screen.</WWText>
			</View>
		</WWScreenView>
	)
}
