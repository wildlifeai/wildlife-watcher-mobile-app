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
}

// TODO perhaps add regex here
export type Command = {
	name: CommandNames
	readCommand?: string
	writeCommand?: string
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
	},
	[CommandNames.VERSION]: {
		name: CommandNames.VERSION,
		readCommand: "ver",
	},
	[CommandNames.BATTERY]: {
		name: CommandNames.BATTERY,
		readCommand: "battery",
	},
	[CommandNames.ENABLE_LORAWAN]: {
		name: CommandNames.ENABLE_LORAWAN,
		writeCommand: "enable",
	},
	[CommandNames.DISABLE_LORAWAN]: {
		name: CommandNames.DISABLE_LORAWAN,
		writeCommand: "disable",
	},
	[CommandNames.STATUS]: {
		name: CommandNames.STATUS,
		readCommand: "status",
	},
	[CommandNames.HEARTBEAT]: {
		name: CommandNames.HEARTBEAT,
		readCommand: "heartbeat",
	},
	[CommandNames.APPEUI]: {
		name: CommandNames.APPEUI,
		readCommand: "get appeui",
	},
	[CommandNames.APPKEY]: {
		name: CommandNames.APPKEY,
		readCommand: "get appkey",
	},
	[CommandNames.PING]: {
		name: CommandNames.PING,
		readCommand: "ping",
	},
}
