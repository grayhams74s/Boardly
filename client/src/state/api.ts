import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Project {
    id: number,
    name: string,
    description?: string,
    startDate?: string,
    endDate?: string
}

export enum  Priority{
    Urgent = "Urgent",
    High = "High",
    Medium = "Medium",
    Low = "Low",
    Backlog = "Backlog"
}

export enum Status {
    ToDo = "To Do",
    WorkInProgress = "Work In Progress",
    UnderReview = "Under Review",
    Completed = "Completed" 
}

export interface User {
    userId?: number;
    username: string;
    email: string;
    profilePictureUrl?: string;
    cognitoId?: string;
    teamId?: number;
}

export interface Attachment {
    id: number;
    fileURL: string;
    fileName: string;
    taskId: number;
    uploadedById: number;
}


export interface Task {
    id: number;
    title: string;
    description?: string;
    status?: Status;
    priority?: Priority;
    tags?: string;
    startDate?: string;
    dueDate?: string;
    points?: number;
    projectId: number;
    authorUserId?: number;
    assignedUserId?: number;

    author?: User;
    assignee?: User;
    comments?: Comment[];
    attachments?: Attachment[];
}

export const api = createApi({
    baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL}),
    reducerPath: "api",
    tagTypes: ["Projects", "Tasks"],
    endpoints: (build) => ({
        getProjects: build.query<Project[], void>({
            query: () => "projects",
            // What does this basically means is that when we grab the API request of projects
            // we're going to get some data on the front end and the way redux toolkit query identifies where that information or data
            // is stored in redux toolkit is via project.
            // This will be helpful later on when we create a project. We can invalidate this particular tag meaning if we create a project
            // Redux toolkit query would be automatically get the new list of projects with that new one you just created. It's going to recall
            // get projects once again so it's always going to give you the updated version if you invalidate properly
            providesTags: ["Projects"]
        }),
        createProject: build.mutation<Project, Partial<Project>>({
            /*W e are going to pass the project object into this particular function to make the API CALL*/
            query: (project) => ({
                url: "projects",
                method: "POST",
                body: project
            }),

            /** So this as i said when we create a project it's going to say hey we need to update this project values,
             *  so that means when you create this project redux tool kit query is automatically going to refetch and grab
             * the entire new list to get projects automatically so that you don't have to deal with the annoying code that you would
             * have to write get projects after this happens. So you dont have to write that you can just write invalidate
             * tag to make sure we have the most updated version of thje projects list. That's why it
             * s very useful to have this.
             */
            invalidatesTags: ["Projects"]
        }),
        /** So the first parameter is obviously task array so that basically that this is right here the return
         * like the schema like how the type of the return is going to look and then the second one is what you're sending
        */
        getTasks: build.query<Task[], { projectId: number }>({
            query: ({projectId}) => `tasks?projectId=${projectId}`,
            providesTags: (result) => result ? result.map(({ id }) => ({ type: "Tasks" as const, id })) : [{ type: "Tasks" as const }]
        }),
        createTask: build.mutation<Task, Partial<Task>>({
            query: (task) => ({
                url: "tasks",
                method: "POST",
                body: task
            }),
            invalidatesTags: ["Tasks"]
        }),
        updateTaskStatus: build.mutation<Task, {taskId: number; status: string}>({
            query: ({ taskId, status }) => ({
                url: `tasks/${taskId}/status`,
                method: "PATCH",
                body: {status}
            }),
            /** Just so you know if you don't fully understand what's happening here specifically is cause when we update tasks status we're updating a specific task and we're doing this via task ID
             * so thats why we do this extra arrow function otherwise we don't want to update the entire list of task we want to update specific tasks anytime we use update task status.
             * 
             * How ever in create Tasks we are updating the entire list because we're creating new task we can get refetch the entire list of task. But when we update task status we want to update one specific task only
             * so we don't have to refetch all the task that we have over here. So thats where doing this arrow function.
             */
            invalidatesTags: (results, error, {taskId}) => [{
                type: "Tasks", id: taskId
            }]
        }),

    })
}); 

/** This will be the function you can think of this as a like a fetch call that will call the backend grab this information
 * but it would automatically just say use get project query that will grab data from the backend that we have and then we can use that
*/
export const {
    useGetProjectsQuery,
    useCreateProjectMutation,
    useGetTasksQuery,
    useCreateTaskMutation,
    useUpdateTaskStatusMutation
} = api;
