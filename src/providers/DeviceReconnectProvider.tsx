import * as React from "react"
import { createContext, useContext } from "react"
import { PropsWithChildren } from "react"

import { ActivityIndicator, StyleSheet, Text, View } from "react-native"
import { ReturnType, useReconnectDevice } from "../hooks/useReconnectDevice"

const DeviceReconnectContext = createContext<ReturnType>({} as ReturnType)

export const useReconnect = () => {
	return useContext(DeviceReconnectContext)
}

type Props = {
	deviceId: string
}

export const DeviceReconnectProvider = ({
	children,
	deviceId,
}: PropsWithChildren<Props>) => {
	const { reconnecting, problem, connected } = useReconnectDevice({
		deviceId,
	})

	/**
	 * If the device reconnects, we simply render a loading screen saying
	 * it's reconnecting. This will make all subsequent logic run again
	 * once the reconnection is done due to the components being unmounted.
	 */
	if (reconnecting) {
		return (
			<View style={styles.container}>
				<Text style={styles.title}>Connection lost</Text>
				<Text style={styles.text}>Reconnecting...</Text>
				<ActivityIndicator />
			</View>
		)
	}

	return (
		<DeviceReconnectContext.Provider
			value={{ problem, reconnecting, connected }}
		>
			{children}
		</DeviceReconnectContext.Provider>
	)
}

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		height: "100%",
		paddingHorizontal: 30,
	},
	title: {
		marginBottom: 20,
	},
	text: {
		marginBottom: 10,
	},
})
