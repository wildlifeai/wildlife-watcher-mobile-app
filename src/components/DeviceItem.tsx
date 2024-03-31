import React from "react"

import { StyleSheet, View } from "react-native"
import { ExtendedPeripheral } from "../redux/slices/devicesSlice"
import { ActivityIndicator, Text, TouchableRipple } from "react-native-paper"

type DeviceItemProps = {
	item: ExtendedPeripheral
	connect: (item: ExtendedPeripheral) => Promise<void>
	disconnect: (item: ExtendedPeripheral) => Promise<void>
	go: (item: ExtendedPeripheral) => Promise<void>
}

export const DeviceItem = React.memo(
	({ item, disconnect, go }: DeviceItemProps) => {
		return (
			<TouchableRipple
				style={styles.card}
				onPress={() => go(item)}
				onLongPress={() => disconnect(item)}
			>
				<View
					style={[
						styles.cardContent,
						item.connected ? { ...styles.connected } : styles.disconnected,
					]}
				>
					<View style={styles.leftView}>
						<Text variant="bodyLarge" numberOfLines={1} style={[styles.uuid]}>
							{item.device.name}
						</Text>
					</View>
					<View style={styles.rightView}>
						{item.loading ? <ActivityIndicator size={22} /> : null}
					</View>
				</View>
			</TouchableRipple>
		)
	},
)

const styles = StyleSheet.create({
	card: {
		paddingVertical: 8,
	},
	connected: { borderRightWidth: 4, borderRightColor: "blue" },
	disconnected: { paddingRight: 4 },
	cardContent: { flexDirection: "row" },
	uuid: {
		fontWeight: "700",
		margin: 2,
	},
	leftView: {
		width: "75%",
	},
	middleView: {
		width: "15%",
		alignItems: "center",
		justifyContent: "space-around",
		height: 70,
		alignSelf: "center",
	},
	rightView: { width: "10%", alignItems: "center", justifyContent: "center" },
	leftButton: {
		marginEnd: 10,
	},
	noconn: { marginStart: "auto" },
	text: {
		margin: 2,
	},
	disabled: {
		backgroundColor: "grey",
	},
	warning: {
		flexDirection: "row",
		alignItems: "center",
		paddingTop: 5,
		justifyContent: "flex-start",
	},
	warningIcon: {
		marginRight: 5,
	},
	warningText: {
		fontWeight: "700",
		flex: 1,
	},
})
