export enum HttpMethod {
	GET = "GET",
	POST = "POST",
	PUT = "PUT",
	DELETE = "DELETE",
	PATCH = "PATCH",
}

// Common Types
export interface BaseEntity {
	_id: string
}

export interface BaseResponse {
	code: number
	message: string
	type?: string
	details?: string
}

// Enums
export enum ProjectRole {
	Manager = "Manager",
	Owner = "Owner",
	User = "User",
}

// Shared Types
export interface ProjectMembership {
	projectID: string
	role: ProjectRole
}

export interface GeoLocation {
	latitude: number
	longitude: number
}

export interface ExifData {
	[key: string]: string
}

// User Types
export interface User extends BaseEntity {
	userId: string
	name?: string
	email?: string
	profilePicUrl?: string
	membershipProjects?: ProjectMembership[]
}

export type UserCreate = Omit<User, "_id" | "userId">
export type UserUpdate = UserCreate

// Device Types
export interface Device extends BaseEntity {
	deviceId: string
	deviceType?: string
	deviceModel?: string
}

export type DeviceCreate = Omit<Device, "_id" | "deviceId">
export type DeviceUpdate = Partial<DeviceCreate>

// Media Types
export interface Media extends BaseEntity {
	mediaID: string
	deploymentId?: string
	fileMediatype?: string
	filePath?: string
	filePublic?: boolean
	exifData?: ExifData
}

export type MediaCreate = Omit<Media, "_id" | "mediaID">
export interface MediaUpdate extends MediaCreate {
	id: string
}

// Observation Types
export interface Observation extends BaseEntity {
	observationId: string
	deploymentId?: string
	mediaID?: string
	eventID?: string
	eventStart?: string
	eventEnd?: string
	observationLevel?: string
	observationType?: string
	scientificName?: string
	count?: number
	individualID?: string
	classificationMethod?: string
	classifiedBy?: string
	classificationTimestamp?: string
	classificationProbability?: number
	observationComments?: string
}

export type ObservationCreate = Omit<Observation, "_id" | "observationId">
export type ObservationUpdate = ObservationCreate

// Project Types
export interface ProjectTeamMember {
	role: string
	userId: string
}

export interface Project extends BaseEntity {
	projectId: string
	title?: string
	acronym?: string
	description?: string
	samplingDesign?: string
	captureMethod?: string
	individualAnimals?: number
	observationLevel?: string
	projectTeam?: ProjectTeamMember[]
	projectPrivacy?: string
}

export type ProjectCreate = Omit<Project, "_id" | "projectId">
export type ProjectUpdate = Omit<ProjectCreate, "projectTeam"> & {
	projectTeam?: ProjectTeamMember[]
}

// Sensor Record Types
export interface SensorRecord extends BaseEntity {
	sensorRecordID: string
	deploymentId?: string
	provider?: string
	sensor_id?: string
	mediaID?: string
	date?: string
	submissionDate?: string
	status?: string
	network?: string
	gateway?: string
	rssi?: number
	sequence?: number
	counter?: number
	battery_voltage?: number
	deviceMemoryAvailable?: number
	snr?: number
	timeout?: number
	extra?: Record<string, unknown>
	meta?: Record<string, unknown>
}

export type SensorRecordCreate = Omit<
	SensorRecord,
	"_id" | "sensorRecordID" | "extra" | "meta"
>
export type SensorRecordUpdate = SensorRecordCreate

// Deployment Types
export interface Deployment extends BaseEntity {
	deploymentId: string
	locationID?: string
	locationName?: string
	projectId?: string
	latitude?: number
	longitude?: number
	coordinateUncertainty?: number
	deploymentStart?: string
	deploymentEnd?: string
	setupBy?: string
	deviceId?: string
	deviceDelay?: number
	deviceHeight?: number
	deviceTilt?: number
	deviceHeading?: number
	detectionDistance?: number
	baitUse?: string
	habitat?: string
	deploymentComments?: string
	deploymentPhotos?: string[]
}

export type DeploymentCreate = Omit<Deployment, "_id" | "deploymentId">
export type DeploymentUpdate = DeploymentCreate

// API Log Types
export interface ApiLog extends BaseEntity {
	logId: string
	apiEndpoint?: string
	requestDate?: string
	responseStatus?: number
	userId?: string
}

export type ApiLogCreate = Omit<ApiLog, "_id" | "logId">
export type ApiLogUpdate = ApiLogCreate

// Response Types
export interface PaginatedResponse<T> {
	data: T[]
	total: number
	page: number
	limit: number
}

export interface ApiResponse<T> {
	data: T
	success: boolean
	error?: BaseResponse
}
