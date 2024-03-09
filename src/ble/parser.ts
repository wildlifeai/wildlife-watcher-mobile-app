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

	if (options.control === CommandControlTypes.WRITE && command.writeCommand) {
		return command.writeCommand(options.value)
	}

	if (options.control === CommandControlTypes.READ && command.readCommand) {
		return command.readCommand
	}

	return undefined
}

const valueChecker = (value: string, command: Command) => {
	if (command.readRegex) {
		const match = command.readRegex.exec(value)

		if (match) {
			return match[1]
		}

		return undefined
	}

	return value
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
		const value = valueChecker(lastBatteryLine, COMMANDS.BATTERY)
		if (value) {
			results.push({
				value,
				command: COMMANDS.BATTERY,
			})
		}
	}

	// ID
	const lastIdLine = checkForLastLine(COMMANDS.ID.readCommand!, lines)

	if (lastIdLine) {
		const value = valueChecker(lastIdLine, COMMANDS.ID)
		if (value) {
			results.push({
				value,
				command: COMMANDS.ID,
			})
		}
	}

	// STATUS

	/**
	 * Special handling here since we parse 2 things out of the
	 * string.
	 */
	const lastStatusLine = checkForLastLine(COMMANDS.STATUS.readCommand!, lines)

	if (lastStatusLine) {
		const matches = COMMANDS.STATUS.readRegex!.exec(lastStatusLine)
		if (matches) {
			const [, trap, lorawan] = matches
			results.push({
				value: {
					trap,
					lorawan,
				},
				command: COMMANDS.STATUS,
			})
		}
	}

	// VERSION
	const lastVersionLine = checkForLastLine(COMMANDS.VERSION.readCommand!, lines)

	if (lastVersionLine) {
		const value = valueChecker(lastVersionLine, COMMANDS.VERSION)
		if (value) {
			results.push({
				value,
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
		const value = valueChecker(lastHeartbeatLine, COMMANDS.HEARTBEAT)
		if (value) {
			results.push({
				value,
				command: COMMANDS.HEARTBEAT,
			})
		}
	}

	// APP EUI
	const lastAppEuiLine = checkForLastLine(COMMANDS.APPEUI.readCommand!, lines)

	if (lastAppEuiLine) {
		const value = valueChecker(lastAppEuiLine, COMMANDS.APPEUI)
		if (value) {
			results.push({
				value,
				command: COMMANDS.APPEUI,
			})
		}
	}

	// APP KEY
	const lastAppKeyLine = checkForLastLine(COMMANDS.APPKEY.readCommand!, lines)

	if (lastAppKeyLine) {
		const value = valueChecker(lastAppKeyLine, COMMANDS.APPKEY)
		if (value) {
			results.push({
				value,
				command: COMMANDS.APPKEY,
			})
		}
	}

	// RESET
	const lastResetLine = checkForLastLine(COMMANDS.RESET.writeCommand!(), lines)

	if (lastResetLine) {
		const value = valueChecker(lastResetLine, COMMANDS.RESET)
		if (value) {
			results.push({
				value,
				command: COMMANDS.RESET,
			})
		}
	}

	// ERASE
	const lastEraseLine = checkForLastLine(COMMANDS.ERASE.writeCommand!(), lines)

	if (lastEraseLine) {
		const value = valueChecker(lastEraseLine, COMMANDS.ERASE)
		if (value) {
			results.push({
				value,
				command: COMMANDS.ERASE,
			})
		}
	}

	return results
}

const checkForLastLine = (name: string, lines: string[]) => {
	const line = lines.lastIndexOf(name)

	if (line !== -1) {
		return lines[line + 1]
	}

	return null
}
