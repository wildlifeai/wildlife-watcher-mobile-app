export type ParseCommands = {
	value?: string
	command?: Command | null
	error?: string
}

export enum CommandNames {
	ID = "ID",
	VERSION = "VERSION",
	BATTERY = "BATTERY",
	ENABLE_LORAWAN = "ENABLE",
	DISABLE_LORAWAN = "DISABLE",
	STATUS = "STATUS",
	HEARTBEAT = "HEARTBEAT",
	APPEUI = "APPEUI",
	APPKEY = "APPKEY",
	PING = "PING",
	RESET = "RESET",
	ERASE = "ERASE",
	DISCONNECT = "DISCONNECT",
}

/**
 * If a command does not have a readCommand defined,
 * it basically means that useCommand will ignore any
 * get calls since we can't really read anything.
 *
 * If in addition to readCommand no readRegex is defined,
 * then it's basically an action only command like for
 * example ble disc, since we get no feedback whatsoever.
 */
export type Command = {
	name: CommandNames
	readCommand?: string
	writeCommand?: (value?: string) => string
	readRegex?: RegExp
}

export const getCommandByName = (name: CommandNames | string) => {
	if (typeof name === "string" && !(name in CommandNames)) {
		return null
	}

	const response = COMMANDS[name as CommandNames]

	if (!response) {
		return null
	}

	return response
}

export enum CommandControlTypes {
	READ = "read",
	WRITE = "write",
}

export type CommandConstructOptions = {
	control: CommandControlTypes
	value?: string
}

export const COMMANDS: {
	[key in CommandNames]: Command
} = {
	[CommandNames.ID]: {
		name: CommandNames.ID,
		readCommand: "id",
		readRegex: /\bDevEui:\s*([0-9A-Fa-f:]+)\b/,
	},
	[CommandNames.VERSION]: {
		name: CommandNames.VERSION,
		readCommand: "ver",
	},
	[CommandNames.BATTERY]: {
		name: CommandNames.BATTERY,
		readCommand: "battery",
		readRegex: /\bBattery\s=\s([0-9.]+V)\b/,
	},
	[CommandNames.ENABLE_LORAWAN]: {
		name: CommandNames.ENABLE_LORAWAN,
		writeCommand: () => "enable",
	},
	[CommandNames.DISABLE_LORAWAN]: {
		name: CommandNames.DISABLE_LORAWAN,
		writeCommand: () => "disable",
	},
	[CommandNames.STATUS]: {
		name: CommandNames.STATUS,
		readCommand: "status",
	},
	[CommandNames.HEARTBEAT]: {
		name: CommandNames.HEARTBEAT,
		readCommand: "get heartbeat",
		readRegex: /\bheartbeat\s+is\s+(\d+s)\b/,
		writeCommand: (value?: string) => `heartbeat ${value}`,
	},
	[CommandNames.APPEUI]: {
		name: CommandNames.APPEUI,
		readCommand: "get appeui",
		readRegex: /\bAppEui\s([a-zA-Z0-9]+)\b/,
		writeCommand: (value?: string) => `appeui ${value}`,
	},
	[CommandNames.APPKEY]: {
		name: CommandNames.APPKEY,
		readCommand: "get appkey",
		readRegex: /\bAppKey\s([a-zA-Z0-9]+)\b/,
		writeCommand: (value?: string) => `appkey ${value}`,
	},
	[CommandNames.PING]: {
		name: CommandNames.PING,
		readCommand: "ping",
	},
	[CommandNames.RESET]: {
		name: CommandNames.RESET,
		writeCommand: () => "reset",
		readRegex: /(Device will reset after disconnecting.)\s*/,
	},
	[CommandNames.ERASE]: {
		name: CommandNames.ERASE,
		writeCommand: () => "erase",
		readRegex: /(NVM will be erased after disconnecting.)\s*/,
	},
	[CommandNames.DISCONNECT]: {
		name: CommandNames.DISCONNECT,
		writeCommand: () => "ble dis",
	},
}
