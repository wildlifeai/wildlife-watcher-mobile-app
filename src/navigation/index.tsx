import { useContext, useEffect } from "react"
import { ParamListBase, RouteProp, useRoute } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAppSelector } from "../redux"
import { BluetoothProblems } from "./screens/BluetoothProblems"
import { LocationProblems } from "./screens/LocationProblems"
import { BleProblems } from "./screens/BleProblems"
import { DeviceReconnectProvider } from "../providers/DeviceReconnectProvider"
import { Home } from "./screens/Home"
import { Terminal } from "./screens/TerminalScreen"
import BootSplash from "react-native-bootsplash"
import { NavigationBar } from "../components/NavigationBar"
import { Login } from "./screens/Login"
import { AuthContext } from "../providers/AuthProvider"
import { AppLoading } from "./screens/AppLoading"

export interface RootStackParamList extends ParamListBase {
	Home: undefined
	DeviceNavigator: { deviceId: string }
	Terminal: { deviceId: string }
}

export type AppParams<T extends keyof RootStackParamList> = RouteProp<
	RootStackParamList,
	T
>

export const Stack = createNativeStackNavigator<RootStackParamList>()

export const MainNavigation = () => {
	const { status, initialLoad: blLoading } = useAppSelector(
		(state) => state.blStatus,
	)
	const { locationEnabled, initialLoad: locLoading } = useAppSelector(
		(state) => state.locationStatus,
	)
	const { initialized, initialLoad: bleLoading } = useAppSelector(
		(state) => state.bleLibrary,
	)
	const { isLoggedIn } = useContext(AuthContext)

	const somethingWrong =
		status !== "PoweredOn" || !locationEnabled || !initialized
	const appLoading = blLoading || locLoading || bleLoading

	useEffect(() => {
		if (!appLoading && somethingWrong) {
			BootSplash.hide({ fade: true })
		}
		if (isLoggedIn !== undefined) {
			BootSplash.hide({ fade: true })
		}
	}, [appLoading, somethingWrong, isLoggedIn])

	/*
	 * Stops the app from running until every important component
	 * loads. In theory this code never runs since the splahscreen
	 * covers the loading, but I kept it here as a last resort since
	 * the app could crash without this check.
	 */
	if (appLoading) {
		return (
			<Stack.Navigator initialRouteName="AppLoading">
				<Stack.Screen
					name="AppLoading"
					component={AppLoading}
					options={{ headerShown: false }}
				/>
			</Stack.Navigator>
		)
	}

	return (
		<Stack.Navigator
			initialRouteName="Home"
			screenOptions={{
				header: NavigationBar,
			}}
		>
			{status !== "PoweredOn" ? (
				<Stack.Screen
					name="BluetoothProblems"
					component={BluetoothProblems}
					options={{ headerShown: false }}
				/>
			) : !locationEnabled ? (
				<Stack.Screen
					name="LocationProblems"
					component={LocationProblems}
					options={{ headerShown: false }}
				/>
			) : !initialized ? (
				<Stack.Screen
					name="BLEProblems"
					component={BleProblems}
					options={{ headerShown: false }}
				/>
			) : (
				<>
					{isLoggedIn ? (
						<Stack.Group>
							<Stack.Screen
								name="Home"
								component={Home}
								options={{ title: "Wildlife Watcher" }}
							/>
							<Stack.Screen
								name="DeviceNavigator"
								options={{ title: "Configure device" }}
								component={DeviceNavigation}
							/>
						</Stack.Group>
					) : (
						<Stack.Screen
							options={{ headerShown: false }}
							name="Login"
							component={Login}
						/>
					)}
				</>
			)}
		</Stack.Navigator>
	)
}

/**
 * This is just a wrapper for device that checks whether the device
 * is locked/connected/inBootloader/upgrading or not. As a provider,
 * it is unique, other providers will later on wrap the navigators
 * as DeviceProviders in the <Device /> component once the device is
 * unlocked.
 */
export const DeviceNavigation = () => {
	const {
		params: { deviceId },
	} = useRoute<AppParams<"DeviceNavigator">>()

	return (
		<DeviceReconnectProvider deviceId={deviceId}>
			<Stack.Navigator screenOptions={{ headerShown: false }}>
				<Stack.Screen
					name="Terminal"
					component={Terminal}
					initialParams={{ deviceId }}
				/>
			</Stack.Navigator>
		</DeviceReconnectProvider>
	)
}
