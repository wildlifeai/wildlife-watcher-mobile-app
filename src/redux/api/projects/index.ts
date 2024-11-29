import { api } from ".."
import { API_URLS } from "../urls"
import { Project, ProjectCreate, ProjectUpdate, HttpMethod } from "../types"

export const projectsApi = api.injectEndpoints({
	endpoints: (builder) => ({
		getProjects: builder.query<Project[], void>({
			query: () => ({
				url: API_URLS.PROJECTS,
				method: HttpMethod.GET,
			}),
			providesTags: (_result) =>
				_result
					? [
							..._result.map(({ _id }) => ({
								type: "Project" as const,
								id: _id,
							})),
							{ type: "Project", id: "LIST" },
					  ]
					: [{ type: "Project", id: "LIST" }],
		}),

		getProjectById: builder.query<Project, string>({
			query: (id) => ({
				url: API_URLS.PROJECT_BY_ID(id),
				method: HttpMethod.GET,
			}),
			providesTags: (_result, _error, id) => [{ type: "Project", id }],
		}),

		createProject: builder.mutation<Project, ProjectCreate>({
			query: (body) => ({
				url: API_URLS.PROJECTS,
				method: HttpMethod.POST,
				body,
			}),
			invalidatesTags: [{ type: "Project", id: "LIST" }],
		}),

		updateProject: builder.mutation<
			Project,
			{ id: string; body: ProjectUpdate }
		>({
			query: ({ id, body }) => ({
				url: API_URLS.PROJECT_BY_ID(id),
				method: HttpMethod.PUT,
				body,
			}),
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "Project", id },
				{ type: "Project", id: "LIST" },
			],
		}),

		deleteProject: builder.mutation<void, string>({
			query: (id) => ({
				url: API_URLS.PROJECT_BY_ID(id),
				method: HttpMethod.DELETE,
			}),
			invalidatesTags: (_result, _error, id) => [
				{ type: "Project", id },
				{ type: "Project", id: "LIST" },
			],
		}),
	}),
})

export const {
	useGetProjectsQuery,
	useGetProjectByIdQuery,
	useCreateProjectMutation,
	useUpdateProjectMutation,
	useDeleteProjectMutation,
} = projectsApi
