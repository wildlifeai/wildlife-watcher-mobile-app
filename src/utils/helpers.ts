import dayjs from "dayjs"
import { ExtendedPeripheral } from "../redux/slices/devicesSlice"
import { log } from "./logger"
import { BLE_CHARACTERISTIC_WRITE_UUID, BLE_SERVICE_UUID } from "./constants"
import BleManager from "react-native-ble-manager"
import { Buffer } from "buffer"
import { readlineParserEmitter } from "../hooks/useBleListeners"

export const clearAllDeviceIntervals = (
	device: ExtendedPeripheral | undefined | null,
) => {
	if (!device) return

	for (const key in device.intervals) {
		const timer = device.intervals[key]

		if (typeof timer === "number") {
			log(`Interval ${key} cleared (ID = ${timer})`)
			clearInterval(timer)
		}
	}
}

export const invokeWithTimeout = async (
	func: Function,
	name: string = "Anonymous",
	timeout: number = 13000,
) => {
	return new Promise(async (resolve, reject) => {
		const id = setTimeout(
			() => reject(Error(`${name} function timed out`)),
			timeout,
		)
		try {
			const result = await func()
			clearTimeout(id)
			resolve(result)
		} catch (error: any) {
			clearTimeout(id)
			reject(Error(error))
		}
	})
}

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

export type WriteFunction = (
	peripheral: ExtendedPeripheral,
	data: string | undefined,
) => Promise<Error | undefined>

const DEVICE_NOT_CONNECTED_ANYMORE = [
	"Device disconnected",
	"Device is not connected",
	"Write failed",
	"Could not find service",
]

export const writeToDevice: WriteFunction = async (peripheral, data) => {
	if (!peripheral.connected) return

	if (data) {
		if (data === "") return

		try {
			const byteArray = [...Buffer.from(data)]

			// Push a LF-CR (LF = 10, CR = 13 in decimal)
			byteArray.push(10)
			byteArray.push(13)

			readlineParserEmitter.emit(
				"BleManagerDidUpdateValueForCharacteristicReadlineParser",
				{ peripheral: peripheral.id, value: byteArray },
			)

			await BleManager.write(
				peripheral.id,
				BLE_SERVICE_UUID,
				BLE_CHARACTERISTIC_WRITE_UUID,
				byteArray,
			)

			log(
				`Written ${data} to the device ${peripheral.name} (${dayjs().format(
					"HH:mm:ss-SSS",
				)})`,
			)
		} catch (e: any) {
			log(
				`Writing ${data} to the device ${peripheral.name} failed with the error: ${e}`,
			)

			/**
			 * If anything goes wrong, return the error so that parent functions
			 * may use it. Currently, we disconnect the device if we detect some
			 * specific errors.
			 */
			const problem = DEVICE_NOT_CONNECTED_ANYMORE.find((errMessage) =>
				e.includes(errMessage),
			)
			if (problem) {
				return Error(e)
			}
		}
	}
}
