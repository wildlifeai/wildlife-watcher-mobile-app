import { NordicDFU, DFUEmitter } from "react-native-nordic-dfu"

export class DfuService {
	static async startDFU(
		deviceAddress: string,
		firmwareFilePath: string,
		onProgress?: (progress: number) => void,
	) {
		try {
			// Set up progress listener
			DFUEmitter.addListener("DFUProgress", (update) => {
				onProgress?.(update.percent || 0)
			})

			const result = await NordicDFU.startDFU({
				deviceAddress,
				filePath: firmwareFilePath,
				alternativeAdvertisingNameEnabled: false,
			})

			// Clean up listener
			DFUEmitter.removeAllListeners("DFUProgress")

			return result
		} catch (error) {
			console.error("DFU failed:", error)
			// Clean up listener on error too
			DFUEmitter.removeAllListeners("DFUProgress")
			throw error
		}
	}
}
