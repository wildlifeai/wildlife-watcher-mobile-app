import * as React from "react"

import { ActivityIndicator, StyleSheet, Text, View } from "react-native"

import { ParamListBase, RouteProp, useRoute } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import { useAppSelector } from "../redux"
import { BluetoothProblems } from "./screens/BluetoothProblems"
import { LocationProblems } from "./screens/LocationProblems"
import { BleProblems } from "./screens/BleProblems"
import { DeviceReconnectProvider } from "../providers/DeviceReconnectProvider"
import { Home } from "./screens/Home"
import { Terminal } from "./screens/TerminalScreen"

export interface RootStackParamList extends ParamListBase {
	Home: {}
	DeviceNavigator: { deviceId: string }
	Terminal: { deviceId: string }
}

export type AppParams<T extends keyof RootStackParamList> = RouteProp<
	RootStackParamList,
	T
>

const Stack = createNativeStackNavigator<RootStackParamList>()

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

	// Stops the app from running until every important component
	// loads.
	if (blLoading || locLoading || bleLoading) {
		return (
			<View style={[styles.loader]}>
				<Text style={styles.title}>App getting ready...</Text>
				<ActivityIndicator size={30} />
			</View>
		)
	}

	return (
		<Stack.Navigator initialRouteName="Home">
			{status !== "PoweredOn" ? (
				<Stack.Screen
					name="BluetoothProblems"
					component={BluetoothProblems}
					options={{ title: "Bluetooth problems" }}
				/>
			) : !locationEnabled ? (
				<Stack.Screen
					name="LocationProblems"
					component={LocationProblems}
					options={{ title: "Location problems" }}
				/>
			) : !initialized ? (
				<Stack.Screen
					name="BLEProblems"
					component={BleProblems}
					options={{ title: "Ble problems" }}
				/>
			) : (
				<>
					<Stack.Group>
						<Stack.Screen
							name="Home"
							component={Home}
							options={{ title: "Nearby devices" }}
						/>
						<Stack.Screen
							name="DeviceNavigator"
							options={{ title: "Configure device" }}
							component={DeviceNavigation}
						/>
					</Stack.Group>
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

const styles = StyleSheet.create({
	loader: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		padding: 30,
	},
	title: {
		marginBottom: 15,
	},
})
