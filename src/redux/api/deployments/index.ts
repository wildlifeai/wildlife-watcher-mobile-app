import { api } from ".."
import { API_URLS } from "../urls"
import {
	Deployment,
	DeploymentCreate,
	DeploymentUpdate,
	HttpMethod,
} from "../types"

export const deploymentsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getDeployments: builder.query<Deployment[], void>({
			query: () => ({
				url: API_URLS.DEPLOYMENTS,
				method: HttpMethod.GET,
			}),
			providesTags: (_result) =>
				_result
					? [
							..._result.map(({ _id }) => ({
								type: "Deployment" as const,
								id: _id,
							})),
							{ type: "Deployment", id: "LIST" },
					  ]
					: [{ type: "Deployment", id: "LIST" }],
		}),

		getDeploymentById: builder.query<Deployment, string>({
			query: (id) => ({
				url: API_URLS.DEPLOYMENT_BY_ID(id),
				method: HttpMethod.GET,
			}),
			providesTags: (_result, _error, id) => [{ type: "Deployment", id }],
		}),

		createDeployment: builder.mutation<Deployment, DeploymentCreate>({
			query: (body) => ({
				url: API_URLS.DEPLOYMENTS,
				method: HttpMethod.POST,
				body,
			}),
			invalidatesTags: [{ type: "Deployment", id: "LIST" }],
		}),

		updateDeployment: builder.mutation<
			Deployment,
			{ id: string; body: DeploymentUpdate }
		>({
			query: ({ id, body }) => ({
				url: API_URLS.DEPLOYMENT_BY_ID(id),
				method: HttpMethod.PUT,
				body,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "Deployment", id },
				{ type: "Deployment", id: "LIST" },
			],
		}),

		deleteDeployment: builder.mutation<void, string>({
			query: (id) => ({
				url: API_URLS.DEPLOYMENT_BY_ID(id),
				method: HttpMethod.DELETE,
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: "Deployment", id },
				{ type: "Deployment", id: "LIST" },
			],
		}),
	}),
})

export const {
	useGetDeploymentsQuery,
	useGetDeploymentByIdQuery,
	useCreateDeploymentMutation,
	useUpdateDeploymentMutation,
	useDeleteDeploymentMutation,
} = deploymentsApi
