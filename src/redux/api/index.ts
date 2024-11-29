import { createApi } from "@reduxjs/toolkit/query/react"
import { extendedBaseQuery } from "./fetch"

const TAG_TYPES = [
	"User",
	"Device",
	"Media",
	"Observation",
	"Project",
	"SensorRecord",
	"Deployment",
	"ApiLog",
] as const

export const api = createApi({
	reducerPath: "api",
	baseQuery: extendedBaseQuery,
	tagTypes: TAG_TYPES,
	endpoints: () => ({}),
})
