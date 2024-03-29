import { useTheme, useRoute, useIsFocused } from "@react-navigation/native"
import * as React from "react"
import { useState } from "react"
import { useCallback } from "react"
import { useEffect } from "react"

import {
	ActivityIndicator,
	Button,
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native"
import { AppParams } from ".."
import { CustomKeyboardAvoidingView } from "../../components/CustomKeyboardAvoidingView"
import { useBleActions } from "../../providers/BleEngineProvider"
import { useAppSelector } from "../../redux"
import { useCommand } from "../../hooks/useCommand"
import { COMMANDS } from "../../ble/types"
import { useSelectDevice } from "../../hooks/useSelectDevice"

type Props = {
	embed?: boolean
}

export const Terminal = ({ embed }: Props) => {
	const scrollViewRef = React.useRef<any>()
	const { colors } = useTheme()
	const {
		params: { deviceId },
	} = useRoute<AppParams<"Terminal">>()
	const deviceLogs = useAppSelector((state) => state.logs)
	const [text, setText] = useState("")
	const isFocused = useIsFocused()
	const { write, pingsPause, disconnectDevice } = useBleActions()
	const device = useSelectDevice({ deviceId })
	const [offset, setOffset] = useState(0)
	const logs = deviceLogs[deviceId]
	const configuration = useAppSelector((state) => state.configuration)

	const config = configuration[deviceId]

	useCommand({ deviceId, command: COMMANDS.BATTERY })
	useCommand({ deviceId, command: COMMANDS.VERSION })
	const { set: setHb } = useCommand({ deviceId, command: COMMANDS.HEARTBEAT })
	const { set: setAppEui } = useCommand({ deviceId, command: COMMANDS.APPEUI })
	const { set: setDevEui } = useCommand({ deviceId, command: COMMANDS.DEVEUI })
	const { set: setSensor } = useCommand({ deviceId, command: COMMANDS.SENSOR })
	const { set: reset } = useCommand({ deviceId, command: COMMANDS.RESET })
	const { set: erase } = useCommand({ deviceId, command: COMMANDS.ERASE })
	const { set: triggerDfu } = useCommand({
		deviceId,
		command: COMMANDS.DFU,
	})

	const [autoscroll, setAutoscroll] = useState(true)

	const writeText = useCallback(async () => {
		await write(device, [text])
		setText("")
	}, [device, text, write])

	useEffect(() => {
		if (!autoscroll) return

		scrollViewRef.current &&
			scrollViewRef.current.scrollToEnd({ animated: true })
		setOffset(0)
	}, [autoscroll, deviceLogs])

	useEffect(() => {
		if (isFocused) {
			/**
			 * Small hack since ref sometimes isn't available
			 * right away.
			 */
			setTimeout(() => {
				scrollViewRef.current &&
					scrollViewRef.current.scrollToEnd({ animated: true })
			}, 50)
		}

		return () => {
			if (!embed && !isFocused) return
			pingsPause(false)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFocused])

	useEffect(() => {
		if (!embed && isFocused) {
			pingsPause(true)
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isFocused])

	const toggleAutoscroll = useCallback((value: boolean) => {
		setAutoscroll(value)
	}, [])

	const onScroll = ({
		nativeEvent,
	}: NativeSyntheticEvent<NativeScrollEvent>) => {
		const { layoutMeasurement, contentOffset, contentSize } = nativeEvent
		const currentOffset = nativeEvent.contentOffset.y
		const goingUp = currentOffset < offset
		const isOnBottom =
			layoutMeasurement.height + contentOffset.y >= contentSize.height - 15
		setOffset(currentOffset)

		if (goingUp) {
			toggleAutoscroll(false)
		}

		if (isOnBottom) {
			toggleAutoscroll(true)
		}
	}

	const { HEARTBEAT, APPEUI, SENSOR, LORAWAN } = config

	if (
		!HEARTBEAT?.loaded ||
		!APPEUI?.loaded ||
		!SENSOR?.loaded ||
		!LORAWAN?.loaded
	) {
		return <ActivityIndicator />
	}

	const hb = HEARTBEAT.value
	const eui = APPEUI.value
	const sensor = SENSOR.value
	const lorawan = LORAWAN.value

	return (
		<CustomKeyboardAvoidingView style={styles.view}>
			<View style={styles.view}>
				<ScrollView
					ref={scrollViewRef}
					onScroll={onScroll}
					scrollEventThrottle={1000}
				>
					<Text style={styles.logs}>{logs}</Text>
				</ScrollView>
				{!autoscroll && (
					<TouchableOpacity
						style={[{ backgroundColor: colors.primary }, styles.fab]}
						onPress={() => {
							toggleAutoscroll(true)
							scrollViewRef.current &&
								scrollViewRef.current.scrollToEnd({ animated: true })
						}}
					>
						<Text style={styles.logs}>Scroll top</Text>
					</TouchableOpacity>
				)}
			</View>
			<View style={styles.input}>
				<TextInput
					autoCorrect={false}
					autoCapitalize="none"
					style={styles.inputText}
					value={text}
					onChangeText={(value: string) => setText(value)}
				/>
				<TouchableOpacity onPress={writeText}>
					<Text>Send</Text>
				</TouchableOpacity>
			</View>
			<View style={styles.buttons}>
				<View style={styles.button}>
					<Button title="Reset" onPress={() => reset()} />
				</View>
				<View style={styles.button}>
					<Button title="Erase" onPress={() => erase()} />
				</View>
				<View style={styles.button}>
					<Button title="Disconnect" onPress={() => disconnectDevice(device)} />
				</View>
				<View style={styles.button}>
					<Button title="DFU mode" onPress={() => triggerDfu()} />
				</View>
			</View>
			<View style={styles.buttons}>
				<View style={styles.button}>
					<Button title="Set Heartbeat" onPress={() => setHb("40s")} />
				</View>
				<View style={styles.button}>
					{config.HEARTBEAT && config.HEARTBEAT.loaded && (
						<Text>Current heartbeat: {hb}</Text>
					)}
				</View>
			</View>
			<View style={styles.buttons}>
				<View style={styles.button}>
					<Button
						title="Set APPEUI"
						onPress={() => setAppEui("AAA4567890123")}
					/>
				</View>
				<View style={styles.button}>
					{config.APPEUI && config.APPEUI.loaded && (
						<Text>Current APPEUI: {eui}</Text>
					)}
				</View>
			</View>
			<View style={styles.buttons}>
				<View style={styles.button}>
					<Text>Should set APPEUI to AAA4567890123. (doesn't work)</Text>
				</View>
			</View>
			<View style={styles.buttons}>
				<View style={styles.button}>
					<Button
						title="Set DEVEUI"
						onPress={() => setDevEui("AAA4567890123")}
					/>
				</View>
				<View style={styles.button}>
					{config.DEVEUI && config.DEVEUI.loaded && (
						<Text>Current DEVEUI: {eui}</Text>
					)}
				</View>
			</View>
			<View style={styles.buttons}>
				<View style={styles.button}>
					<Text>Should set DEVEUI to BBB4567890123. (doesn't work)</Text>
				</View>
			</View>
			<View style={styles.buttons}>
				<View style={styles.button}>
					<Button
						title="Set sensor"
						onPress={() =>
							setSensor(sensor === "enable" ? "disable" : "enable")
						}
					/>
				</View>
			</View>
			<View style={styles.buttons}>
				<View style={styles.button}>
					<Text>
						Sensor is{" "}
						{sensor === "enable" ? (
							<Text style={styles.bold}>enabled</Text>
						) : (
							<Text style={styles.bold}>disabled</Text>
						)}
					</Text>
					<Text>
						Lorawan status: <Text style={styles.bold}>{lorawan}</Text>
					</Text>
				</View>
			</View>
		</CustomKeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	view: { height: 200 },
	fab: {
		position: "absolute",
		bottom: 20,
		right: 20,
	},
	logs: {
		fontSize: 8,
		color: "#333333",
		padding: 10,
		paddingStart: 20,
	},
	input: {
		flexDirection: "row",
		alignItems: "center",
		height: 40,
		borderWidth: 1,
	},
	inputText: { flex: 2 },
	buttons: {
		flexDirection: "row",
		alignItems: "center",
		margin: 5,
	},
	button: {
		marginHorizontal: 5,
	},
	bold: {
		fontWeight: "900",
	},
})
