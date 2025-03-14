import { useEffect } from "react"
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
import { AppLoading } from "./screens/AppLoading"
import { AppDrawer } from "../components/AppDrawer"
import { Notifications } from "./screens/Notifications"
import { CommunityDiscussion } from "./screens/CommunityDiscussion"
import { Profile } from "./screens/Profile"
import { Settings } from "./screens/Settings"
import { DfuScreen } from "./screens/DfuScreen"
import { Login } from "./screens/Login"
import { Register } from "./screens/Register"

export interface RootStackParamList extends ParamListBase {
	CommunityDiscussion: undefined
	Notifications: undefined
	Profile: undefined
	Settings: undefined
	Home: undefined
	DeviceNavigator: { deviceId: string }
	Terminal: { deviceId: string }
	DfuScreen: { deviceId: string }
	Login: undefined
	Register: undefined
}

export type Routes = keyof RootStackParamList

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
	const { token, initialLoad: authLoading } = useAppSelector(
		(state) => state.authentication,
	)

	const appLoading = blLoading || locLoading || bleLoading || authLoading

	useEffect(() => {
		if (!appLoading) {
			BootSplash.hide({ fade: true })
		}
	}, [appLoading])

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
		<AppDrawer>
			<Stack.Navigator
				initialRouteName="Home"
				screenOptions={{
					header: NavigationBar,
				}}
			>
				{!["PoweredOn", "Unsupported"].includes(status) ? (
					<Stack.Screen
						name="BluetoothProblems"
						component={BluetoothProblems}
						options={{ headerShown: false }}
					/>
				) : !locationEnabled ? (
					<Stack.Screen
						options={{ headerShown: false }}
						name="LocationProblems"
						component={LocationProblems}
					/>
				) : !initialized ? (
					<Stack.Screen
						options={{ headerShown: false }}
						name="BLEProblems"
						component={BleProblems}
					/>
				) : !token ? (
					<Stack.Group screenOptions={{ headerShown: false }}>
						<Stack.Screen name="Login" component={Login} />
						<Stack.Screen name="Register" component={Register} />
					</Stack.Group>
				) : (
					<Stack.Group>
						<Stack.Screen
							name="Home"
							component={Home}
							options={{ title: "Wildlife Watcher" }}
						/>
						<Stack.Screen
							name="Notifications"
							component={Notifications}
							options={{ title: "Notifications" }}
						/>
						<Stack.Screen
							name="CommunityDiscussion"
							component={CommunityDiscussion}
							options={{ title: "Community Discussion" }}
						/>
						<Stack.Screen
							name="Profile"
							component={Profile}
							options={{ title: "Profile" }}
						/>
						<Stack.Screen
							name="Settings"
							component={Settings}
							options={{ title: "Settings" }}
						/>
						<Stack.Screen
							name="DeviceNavigator"
							options={{ title: "Configure device" }}
							component={DeviceNavigation} // Nested navigator here
						/>
						<Stack.Screen
							name="DfuScreen"
							component={DfuScreen}
							options={{ title: "Firmware Update" }}
						/>
					</Stack.Group>
				)}
			</Stack.Navigator>
		</AppDrawer>
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
