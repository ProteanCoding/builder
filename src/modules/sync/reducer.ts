import { STORAGE_LOAD } from 'decentraland-dapps/dist/modules/storage/actions'

import {
  SAVE_PROJECT_REQUEST,
  SaveProjectRequestAction,
  SaveProjectSuccessAction,
  SAVE_PROJECT_SUCCESS,
  SaveProjectFailureAction,
  SAVE_PROJECT_FAILURE,
  SAVE_DEPLOYMENT_REQUEST,
  SaveDeploymentRequestAction,
  SaveDeploymentSuccessAction,
  SaveDeploymentFailureAction,
  SAVE_DEPLOYMENT_SUCCESS,
  SAVE_DEPLOYMENT_FAILURE
} from 'modules/sync/actions'
import { StorageLoadAction } from 'modules/common/types'
import { domainReducer, INITIAL_STATE as DOMAIN_INITIAL_STATE } from './domain/reducer'
import { success, init, request, failure, create, remove } from './domain/actions'
import { SyncState } from './types'
import { CREATE_PROJECT, CreateProjectAction, DELETE_PROJECT, DeleteProjectAction } from 'modules/project/actions'
import {
  DeployToLandSuccessAction,
  DEPLOY_TO_LAND_SUCCESS,
  CLEAR_DEPLOYMENT_SUCCESS,
  ClearDeploymentSuccessAction
} from 'modules/deployment/actions'

const INITIAL_STATE: SyncState = {
  project: DOMAIN_INITIAL_STATE,
  deployment: DOMAIN_INITIAL_STATE
}

export type SyncReducerAction =
  | SaveProjectRequestAction
  | SaveProjectSuccessAction
  | SaveProjectFailureAction
  | SaveDeploymentRequestAction
  | SaveDeploymentSuccessAction
  | SaveDeploymentFailureAction
  | CreateProjectAction
  | DeployToLandSuccessAction
  | DeleteProjectAction
  | ClearDeploymentSuccessAction
  | StorageLoadAction

export const syncReducer = (state = INITIAL_STATE, action: SyncReducerAction): SyncState => {
  switch (action.type) {
    case STORAGE_LOAD: {
      const { payload } = action
      const projectIds = payload.project && payload.project.data ? Object.keys(payload.project.data) : []
      const deploymentIds = payload.deployment && payload.deployment.data ? Object.keys(payload.deployment.data) : []
      return {
        ...state,
        project: domainReducer(state.project, init(projectIds)),
        deployment: domainReducer(state.deployment, init(deploymentIds))
      }
    }
    case SAVE_PROJECT_REQUEST: {
      const { project } = action.payload
      return {
        ...state,
        project: domainReducer(state.project, request(project.id))
      }
    }
    case SAVE_DEPLOYMENT_REQUEST: {
      const { deployment } = action.payload
      return {
        ...state,
        deployment: domainReducer(state.project, request(deployment.id))
      }
    }
    case SAVE_PROJECT_SUCCESS: {
      const { project } = action.payload
      return {
        ...state,
        project: domainReducer(state.project, success(project.id))
      }
    }
    case SAVE_DEPLOYMENT_SUCCESS: {
      const { deployment } = action.payload
      return {
        ...state,
        deployment: domainReducer(state.deployment, success(deployment.id))
      }
    }
    case SAVE_PROJECT_FAILURE: {
      const { project, error } = action.payload
      return {
        ...state,
        project: domainReducer(state.project, failure(project.id, error))
      }
    }
    case SAVE_DEPLOYMENT_FAILURE: {
      const { deployment, error } = action.payload
      return {
        ...state,
        deployment: domainReducer(state.deployment, failure(deployment.id, error))
      }
    }
    case CREATE_PROJECT: {
      const { project } = action.payload
      return {
        ...state,
        project: domainReducer(state.project, create(project.id))
      }
    }
    case DEPLOY_TO_LAND_SUCCESS: {
      const { deployment } = action.payload
      return {
        ...state,
        deployment: domainReducer(state.project, create(deployment.id))
      }
    }
    case DELETE_PROJECT: {
      const { project } = action.payload
      return {
        ...state,
        project: domainReducer(state.project, remove(project.id)),
        deployment: domainReducer(state.deployment, remove(project.id))
      }
    }
    case CLEAR_DEPLOYMENT_SUCCESS: {
      const { projectId } = action.payload
      return {
        ...state,
        deployment: domainReducer(state.deployment, remove(projectId))
      }
    }
    default:
      return state
  }
}
