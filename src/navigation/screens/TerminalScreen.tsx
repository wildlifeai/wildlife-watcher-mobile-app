import { useTheme, useRoute, useIsFocused } from "@react-navigation/native"
import * as React from "react"
import { useState } from "react"
import { useCallback } from "react"
import { useMemo } from "react"
import { useEffect } from "react"

import {
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
	const { write, pingsPause } = useBleActions()
	const devices = useAppSelector((state) => state.devices)
	const device = useMemo(() => devices[deviceId], [deviceId, devices])
	const [offset, setOffset] = useState(0)
	const logs = deviceLogs[deviceId]
	const configuration = useAppSelector((state) => state.configuration)

	console.log(configuration)

	useCommand({ deviceId, command: COMMANDS.BATTERY })
	useCommand({ deviceId, command: COMMANDS.VERSION })
	useCommand({ deviceId, command: COMMANDS.HEARTBEAT })
	useCommand({ deviceId, command: COMMANDS.APPEUI })
	useCommand({ deviceId, command: COMMANDS.APPKEY })
	useCommand({ deviceId, command: COMMANDS.STATUS })

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
		</CustomKeyboardAvoidingView>
	)
}

const styles = StyleSheet.create({
	view: { flex: 1 },
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
})
