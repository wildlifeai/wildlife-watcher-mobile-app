import {
	COMMANDS,
	Command,
	CommandConstructOptions,
	CommandControlTypes,
	CommandNames,
	ParseCommands,
	getCommandByName,
} from "./types"

export const constructCommandString = (
	name: CommandNames | string,
	options: CommandConstructOptions,
) => {
	const command = getCommandByName(name)

	if (!command) {
		return undefined
	}

	if (options.control === CommandControlTypes.WRITE) {
		// IMPLEMENT COMMAND CONSTRUCTION HERE
		return command.writeCommand
	}

	if (options.control === CommandControlTypes.READ) {
		return command.readCommand
	}

	return undefined
}

export const parseLogs = (finishedLog: string, lastLog: string) => {
	if (lastLog.trim().length === 0) return []
	if (!lastLog.match(/\n/)) return []

	const results: ParseCommands[] = []

	const lines = finishedLog.split("\n\r")

	if (!lines[0]) return []

	/**
	 * Custom parsing logic below for each command.
	 */

	// BATTERY
	const lastBatteryLine = checkForLastLine(COMMANDS.BATTERY.readCommand!, lines)

	if (lastBatteryLine) {
		if (valueChecker(lastBatteryLine, "Battery = ")) {
			results.push({
				value: lastBatteryLine,
				command: COMMANDS.BATTERY,
			})
		}
	}

	// ID
	const lastIdLine = checkForLastLine(COMMANDS.ID.readCommand!, lines)

	if (lastIdLine) {
		if (valueChecker(lastIdLine, "DevEui: ")) {
			results.push({
				value: lastIdLine,
				command: COMMANDS.ID,
			})
		}
	}

	// STATUS
	const lastStatusLine = checkForLastLine(COMMANDS.STATUS.readCommand!, lines)

	if (lastStatusLine) {
		if (valueChecker(lastStatusLine)) {
			results.push({
				value: lastStatusLine,
				command: COMMANDS.STATUS,
			})
		}
	}

	// VERSION
	const lastVersionLine = checkForLastLine(COMMANDS.VERSION.readCommand!, lines)

	if (lastVersionLine) {
		if (valueChecker(lastVersionLine)) {
			results.push({
				value: lastVersionLine,
				command: COMMANDS.VERSION,
			})
		}
	}

	// HEARTBEAT
	const lastHeartbeatLine = checkForLastLine(
		COMMANDS.HEARTBEAT.readCommand!,
		lines,
	)

	if (lastHeartbeatLine) {
		if (valueChecker(lastHeartbeatLine)) {
			results.push({
				value: lastHeartbeatLine,
				command: COMMANDS.HEARTBEAT,
			})
		}
	}

	// APP EUI
	const lastAppEuiLine = checkForLastLine(COMMANDS.APPEUI.readCommand!, lines)

	if (lastAppEuiLine) {
		if (valueChecker(lastAppEuiLine)) {
			results.push({
				value: lastAppEuiLine,
				command: COMMANDS.APPEUI,
			})
		}
	}

	// APP KEY
	const lastAppKeyLine = checkForLastLine(COMMANDS.APPKEY.readCommand!, lines)

	if (lastAppKeyLine) {
		if (valueChecker(lastAppKeyLine)) {
			results.push({
				value: lastAppKeyLine,
				command: COMMANDS.APPKEY,
			})
		}
	}

	return results
}

const valueChecker = (
	value: string,
	shouldContain?: string,
	_command?: Command,
) => {
	if (shouldContain) {
		return value && value.startsWith(shouldContain)
	}

	return !!value
}

const checkForLastLine = (name: string, lines: string[]) => {
	const line = lines.lastIndexOf(name)

	if (line !== -1) {
		return lines[line + 1]
	}

	return null
}
