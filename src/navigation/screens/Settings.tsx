import { View } from "react-native"
import { WWScreenView } from "../../components/ui/WWScreenView"
import { WWText } from "../../components/ui/WWText"

export const Settings = () => {
	return (
		<WWScreenView>
			<View>
				<WWText variant="titleSmall">Settings screen.</WWText>
			</View>
		</WWScreenView>
	)
}
