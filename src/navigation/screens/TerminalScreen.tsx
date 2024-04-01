import { useRoute, useIsFocused } from "@react-navigation/native"
import * as React from "react"
import { useState } from "react"
import { useCallback } from "react"
import { useEffect } from "react"

import {
	NativeScrollEvent,
	NativeSyntheticEvent,
	ScrollView,
	StyleSheet,
	View,
} from "react-native"
import { AppParams } from ".."
import { CustomKeyboardAvoidingView } from "../../components/CustomKeyboardAvoidingView"
import { useBleActions } from "../../providers/BleEngineProvider"
import { useAppSelector } from "../../redux"
import { useCommand } from "../../hooks/useCommand"
import { COMMANDS } from "../../ble/types"
import { useSelectDevice } from "../../hooks/useSelectDevice"
import {
	ActivityIndicator,
	Button,
	IconButton,
	TextInput,
	useTheme,
} from "react-native-paper"
import { WWText } from "../../components/ui/WWText"

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
		<CustomKeyboardAvoidingView style={styles.scroll}>
			<View style={styles.view}>
				<ScrollView
					ref={scrollViewRef}
					onScroll={onScroll}
					scrollEventThrottle={1000}
				>
					<WWText variant="bodySmall" style={styles.logs}>
						{logs}
					</WWText>
				</ScrollView>
				{!autoscroll && (
					<IconButton
						icon="chevron-down"
						mode="contained"
						iconColor={colors.primary}
						style={styles.fab}
						onPress={() => {
							toggleAutoscroll(true)
							scrollViewRef.current &&
								scrollViewRef.current.scrollToEnd({ animated: true })
						}}
					/>
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

				<IconButton
					iconColor={colors.primary}
					icon="send"
					size={30}
					onPress={writeText}
				/>
			</View>
			<View style={styles.scrollContainer}>
				<ScrollView style={styles.scroll}>
					<View style={styles.buttons}>
						<View style={styles.button}>
							<Button mode="elevated" onPress={() => reset()}>
								Reset
							</Button>
						</View>
						<View style={styles.button}>
							<Button mode="elevated" onPress={() => erase()}>
								Erase
							</Button>
						</View>
						<View style={styles.button}>
							<Button mode="elevated" onPress={() => disconnectDevice(device)}>
								Disconnect
							</Button>
						</View>
						<View style={styles.button}>
							<Button mode="elevated" onPress={() => triggerDfu()}>
								DFU mode
							</Button>
						</View>
					</View>
					<View style={styles.buttons}>
						<View style={styles.button}>
							<Button mode="elevated" onPress={() => setHb("40s")}>
								Set Heartbeat
							</Button>
						</View>
						<View style={styles.button}>
							{config.HEARTBEAT && config.HEARTBEAT.loaded && (
								<WWText>Current heartbeat: {hb}</WWText>
							)}
						</View>
					</View>
					<View style={styles.buttons}>
						<View style={styles.button}>
							<Button
								mode="elevated"
								onPress={() => setAppEui("AAA4567890123")}
							>
								Set APPEUI
							</Button>
						</View>
						<View style={styles.button}>
							{config.APPEUI && config.APPEUI.loaded && (
								<WWText>Current APPEUI: {eui}</WWText>
							)}
						</View>
					</View>
					<View style={styles.buttons}>
						<View style={styles.button}>
							<WWText>
								Should set APPEUI to AAA4567890123. (doesn't work)
							</WWText>
						</View>
					</View>
					<View style={styles.buttons}>
						<View style={styles.button}>
							<Button
								mode="elevated"
								onPress={() => setDevEui("AAA4567890123")}
							>
								Set DEVEUI
							</Button>
						</View>
						<View style={styles.button}>
							{config.DEVEUI && config.DEVEUI.loaded && (
								<WWText>Current DEVEUI: {eui}</WWText>
							)}
						</View>
					</View>
					<View style={styles.buttons}>
						<View style={styles.button}>
							<WWText>
								Should set DEVEUI to BBB4567890123. (doesn't work)
							</WWText>
						</View>
					</View>
					<View style={styles.buttons}>
						<View style={styles.button}>
							<Button
								mode="elevated"
								onPress={() =>
									setSensor(sensor === "enable" ? "disable" : "enable")
								}
							>
								Set sensor
							</Button>
						</View>
					</View>
					<View style={styles.buttons}>
						<View style={styles.button}>
							<WWText>
								Sensor is{" "}
								{sensor === "enable" ? (
									<WWText style={styles.bold}>enabled</WWText>
								) : (
									<WWText style={styles.bold}>disabled</WWText>
								)}
							</WWText>
							<WWText>
								Lorawan status: <WWText style={styles.bold}>{lorawan}</WWText>
							</WWText>
						</View>
					</View>
				</ScrollView>
			</View>
		</CustomKeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	scrollContainer: { flex: 1, margin: 10 },
	scroll: { flex: 1 },
	view: { height: 200 },
	fab: {
		position: "absolute",
		bottom: 20,
		right: 20,
	},
	logs: {
		fontSize: 8,
		margin: 10,
		marginBottom: 20,
		paddingStart: 10,
	},
	input: {
		flexDirection: "row",
		alignItems: "center",
		height: 40,
	},
	inputText: { flex: 2 },
	buttons: {
		flexDirection: "row",
		flexWrap: "wrap",
		alignItems: "center",
		padding: 5,
	},
	button: {
		margin: 5,
	},
	bold: {
		fontWeight: "900",
	},
})
