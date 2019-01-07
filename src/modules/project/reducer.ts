import { loadingReducer, LoadingState } from 'decentraland-dapps/dist/modules/loading/reducer'
import { ModelById } from 'decentraland-dapps/dist/lib/types'
import { Project } from 'modules/project/types'
import { CreateProjectAction, CREATE_PROJECT } from 'modules/project/actions'

export type ProjectState = {
  data: ModelById<Project>
  loading: LoadingState
  error: string | null
}

const INITIAL_STATE: ProjectState = {
  data: {},
  loading: [],
  error: null
}

export type ProjectReducerAction = CreateProjectAction

export const projectReducer = (state = INITIAL_STATE, action: ProjectReducerAction): ProjectState => {
  switch (action.type) {
    case CREATE_PROJECT: {
      const { project } = action.payload
      return {
        loading: loadingReducer(state.loading, action),
        error: null,
        data: {
          ...state.data,
          [project.id]: { ...project }
        }
      }
    }
    default:
      return state
  }
}
