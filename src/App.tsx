import { Suspense } from "react"

import { SafeAreaProvider } from "react-native-safe-area-context"
import { Provider as ReduxProvider } from "react-redux"
import { AndroidPermissionsProvider } from "./providers/AndroidPermissionsProvider"
import { AppSetupProvider } from "./providers/AppSetupProvider"
import { BleEngineProvider } from "./providers/BleEngineProvider"
import store from "./redux"
import { MainNavigation } from "./navigation"
import { NavigationContainer } from "@react-navigation/native"
import { ListenToBleEngineProvider } from "./providers/ListenToBleEngineProvider"
import { PaperProvider } from "react-native-paper"
import { CombinedDefaultTheme } from "./theme"

export const App = () => {
	return (
		<SafeAreaProvider>
			<Suspense fallback={"Loading..."}>
				<ReduxProvider store={store}>
					<PaperProvider theme={CombinedDefaultTheme}>
						<NavigationContainer theme={CombinedDefaultTheme}>
							<AndroidPermissionsProvider>
								<AppSetupProvider>
									<BleEngineProvider>
										<ListenToBleEngineProvider>
											<MainNavigation />
										</ListenToBleEngineProvider>
									</BleEngineProvider>
								</AppSetupProvider>
							</AndroidPermissionsProvider>
						</NavigationContainer>
					</PaperProvider>
				</ReduxProvider>
			</Suspense>
		</SafeAreaProvider>
	)
}
