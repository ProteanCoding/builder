import { MerkleDistributorInfo } from '@dcl/content-hash-tree/dist/types'
import { ChainId } from '@dcl/schemas'
import { Collection } from 'modules/collection/types'
import { ThirdPartyBuildEntityError, ThirdPartyDeploymentError, ThirdPartyError } from 'modules/collection/utils'
import { mockedItem } from 'specs/item'
import {
  fetchThirdPartiesRequest,
  fetchThirdPartiesSuccess,
  fetchThirdPartiesFailure,
  deployBatchedThirdPartyItemsRequest,
  DEPLOY_BATCHED_THIRD_PARTY_ITEMS_SUCCESS,
  deployBatchedThirdPartyItemsSuccess,
  deployBatchedThirdPartyItemsFailure,
  DEPLOY_BATCHED_THIRD_PARTY_ITEMS_FAILURE,
  disableThirdPartyRequest,
  disableThirdPartySuccess,
  disableThirdPartyFailure,
  publishAndPushChangesThirdPartyItemsRequest,
  publishAndPushChangesThirdPartyItemsSuccess,
  publishAndPushChangesThirdPartyItemsFailure,
  fetchThirdPartyRequest,
  fetchThirdPartySuccess,
  fetchThirdPartyFailure,
  FINISH_PUBLISH_AND_PUSH_CHANGES_THIRD_PARTY_ITEMS_REQUEST,
  finishPublishAndPushChangesThirdPartyItemsSuccess,
  finishPublishAndPushChangesThirdPartyItemsFailure,
  setThirdPartyKindRequest,
  setThirdPartyKindSuccess,
  setThirdPartyKindFailure
} from './actions'
import { INITIAL_STATE, thirdPartyReducer, ThirdPartyState } from './reducer'
import { ThirdParty } from './types'

let thirdParty: ThirdParty
let state: ThirdPartyState

beforeEach(() => {
  thirdParty = {
    id: '1',
    root: '',
    isApproved: true,
    name: 'a third party',
    description: 'some desc',
    managers: ['0x1', '0x2'],
    contracts: [],
    maxItems: '0',
    totalItems: '0',
    published: false,
    isProgrammatic: false
  }

  state = {
    ...INITIAL_STATE
  }
})

describe('when an action of type FETCH_THIRD_PARTIES_REQUEST is called', () => {
  it('should add a fetchThirdPartiesRequest to the loading array', () => {
    expect(thirdPartyReducer(state, fetchThirdPartiesRequest())).toStrictEqual({
      ...state,
      loading: [fetchThirdPartiesRequest()]
    })
  })
})

describe('when an action of type FETCH_THIRD_PARTIES_SUCCESS is called', () => {
  beforeEach(() => {
    state = {
      ...state,
      loading: [fetchThirdPartiesRequest()],
      error: 'Some Error',
      errors: []
    }
  })

  it('should add the collections to the data, remove the action from loading and set the error to null', () => {
    expect(thirdPartyReducer(state, fetchThirdPartiesSuccess([thirdParty]))).toStrictEqual({
      data: {
        [thirdParty.id]: thirdParty
      },
      loading: [],
      error: null,
      errors: []
    })
  })
})

describe('when an action of type FETCH_THIRD_PARTIES_FAILURE is called', () => {
  it('should remove the corresponding request action, and set the error', () => {
    expect(
      thirdPartyReducer({ ...INITIAL_STATE, loading: [fetchThirdPartiesRequest()] }, fetchThirdPartiesFailure('Some Error'))
    ).toStrictEqual({
      ...INITIAL_STATE,
      error: 'Some Error'
    })
  })
})

describe('when reducing an DEPLOY_BATCHED_THIRD_PARTY_ITEMS_REQUEST action', () => {
  it('should add the action to the loading array', () => {
    expect(
      thirdPartyReducer(state, deployBatchedThirdPartyItemsRequest([], {} as Collection, {} as MerkleDistributorInfo, {}))
    ).toStrictEqual({
      ...INITIAL_STATE,
      loading: [deployBatchedThirdPartyItemsRequest([], {} as Collection, {} as MerkleDistributorInfo, {})]
    })
  })
})

describe('when reducing an DEPLOY_BATCHED_THIRD_PARTY_ITEMS_SUCCESS action', () => {
  it('should remove the corresponding request action from the loading state and set the error to null', () => {
    expect(
      thirdPartyReducer(
        { ...state, error: 'someError', loading: [{ type: DEPLOY_BATCHED_THIRD_PARTY_ITEMS_SUCCESS }] },
        deployBatchedThirdPartyItemsSuccess({} as Collection, [])
      )
    ).toStrictEqual({
      ...INITIAL_STATE,
      loading: [],
      error: null
    })
  })
})

describe('when reducing an DEPLOY_BATCHED_THIRD_PARTY_ITEMS_FAILURE action', () => {
  let errors: ThirdPartyError[]
  beforeEach(() => {
    errors = [new ThirdPartyDeploymentError(mockedItem), new ThirdPartyBuildEntityError(mockedItem)]
  })
  it('should remove the corresponding request action from the loading state and set the error', () => {
    expect(
      thirdPartyReducer(
        { ...state, loading: [{ type: DEPLOY_BATCHED_THIRD_PARTY_ITEMS_FAILURE }] },
        deployBatchedThirdPartyItemsFailure(errors, 'error')
      )
    ).toStrictEqual({
      ...INITIAL_STATE,
      loading: [],
      error: 'error',
      errors
    })
  })
})

describe('when reducing a DISABLE_THIRD_PARTY_REQUEST action', () => {
  beforeEach(() => {
    state = {
      ...state,
      error: 'Some error',
      errors: [new ThirdPartyDeploymentError(mockedItem)]
    }
  })

  it('should add the action to the loading array and clear the errors', () => {
    expect(thirdPartyReducer(state, disableThirdPartyRequest('anId'))).toStrictEqual({
      ...INITIAL_STATE,
      loading: [disableThirdPartyRequest('anId')],
      error: null,
      errors: []
    })
  })
})

describe('when reducing a DISABLE_THIRD_PARTY_SUCCESS action', () => {
  beforeEach(() => {
    state = {
      ...state,
      loading: [disableThirdPartyRequest('anId')],
      data: {
        anId: thirdParty
      }
    }
  })

  it('should remove the corresponding request action from the loading state and set the third party as not approved', () => {
    expect(thirdPartyReducer(state, disableThirdPartySuccess('anId', ChainId.MATIC_MAINNET, 'aTxHash', 'thirdPartyName'))).toStrictEqual({
      ...INITIAL_STATE,
      data: {
        anId: {
          ...thirdParty,
          isApproved: false
        }
      },
      loading: []
    })
  })
})

describe('when reducing a DISABLE_THIRD_PARTY_FAILURE action', () => {
  let error: string

  beforeEach(() => {
    error = 'anError'
    state = {
      ...state,
      loading: [disableThirdPartyRequest('anId')],
      data: {}
    }
  })

  it('should remove the corresponding request action from the loading state and set the error', () => {
    expect(thirdPartyReducer(state, disableThirdPartyFailure(error))).toStrictEqual({
      ...INITIAL_STATE,
      loading: [],
      error
    })
  })
})

describe('when reducing a PUBLISH_AND_PUSH_CHANGES_THIRD_PARTY_ITEMS_REQUEST action', () => {
  it('should add the action to the loading array and clear the errors', () => {
    expect(
      thirdPartyReducer(
        { ...INITIAL_STATE, error: 'anError', errors: [new ThirdPartyDeploymentError(mockedItem)] },
        publishAndPushChangesThirdPartyItemsRequest(thirdParty, [], [])
      )
    ).toEqual({
      ...INITIAL_STATE,
      loading: [publishAndPushChangesThirdPartyItemsRequest(thirdParty, [], [])],
      error: null,
      errors: []
    })
  })
})

describe('when reducing a PUBLISH_AND_PUSH_CHANGES_THIRD_PARTY_ITEMS_SUCCESS action', () => {
  beforeEach(() => {
    state = {
      ...state,
      loading: [publishAndPushChangesThirdPartyItemsRequest(thirdParty, [], [])]
    }
  })

  it('should remove the corresponding request action from the loading state and set the finishing action as loading', () => {
    expect(thirdPartyReducer(state, publishAndPushChangesThirdPartyItemsSuccess(thirdParty, {} as Collection, [], []))).toEqual({
      ...INITIAL_STATE,
      loading: [{ type: FINISH_PUBLISH_AND_PUSH_CHANGES_THIRD_PARTY_ITEMS_REQUEST }]
    })
  })
})

describe('when reducing a PUBLISH_AND_PUSH_CHANGES_THIRD_PARTY_ITEMS_FAILURE action', () => {
  beforeEach(() => {
    state = { ...state, loading: [publishAndPushChangesThirdPartyItemsRequest(thirdParty, [], [])] }
  })

  it('should remove the corresponding request action from the loading state and set the error', () => {
    expect(thirdPartyReducer(state, publishAndPushChangesThirdPartyItemsFailure('anError'))).toEqual({
      ...INITIAL_STATE,
      loading: [],
      error: 'anError'
    })
  })
})

describe('when reducing a FINISH_PUBLISH_AND_PUSH_CHANGES_THIRD_PARTY_ITEMS_SUCCESS action', () => {
  beforeEach(() => {
    state = {
      ...state,
      data: { [thirdParty.id]: { ...thirdParty, published: false } },
      loading: [{ type: FINISH_PUBLISH_AND_PUSH_CHANGES_THIRD_PARTY_ITEMS_REQUEST }],
      error: 'anError'
    }
  })

  it('should remove the corresponding request action, set the third party as published and clear the errors', () => {
    expect(thirdPartyReducer(state, finishPublishAndPushChangesThirdPartyItemsSuccess(thirdParty, 'aCollectionId', []))).toEqual({
      ...INITIAL_STATE,
      data: {
        [thirdParty.id]: {
          ...thirdParty,
          published: true
        }
      },
      loading: [],
      error: null
    })
  })
})

describe('when reducing a FINISH_PUBLISH_AND_PUSH_CHANGES_THIRD_PARTY_ITEMS_FAILURE action', () => {
  beforeEach(() => {
    state = {
      ...state,
      loading: [{ type: FINISH_PUBLISH_AND_PUSH_CHANGES_THIRD_PARTY_ITEMS_REQUEST }],
      error: null
    }
  })

  it('should remove the corresponding request action from the loading state and set the error', () => {
    expect(thirdPartyReducer(state, finishPublishAndPushChangesThirdPartyItemsFailure('anError'))).toEqual({
      ...INITIAL_STATE,
      loading: [],
      error: 'anError'
    })
  })
})

describe('when reducing a FETCH_THIRD_PARTY_REQUEST action', () => {
  beforeEach(() => {
    state = {
      ...state,
      error: 'Some error',
      errors: [new ThirdPartyDeploymentError(mockedItem)]
    }
  })

  it('should add the action to the loading array and clear the errors', () => {
    expect(thirdPartyReducer(state, fetchThirdPartyRequest('anId'))).toEqual({
      ...INITIAL_STATE,
      loading: [fetchThirdPartyRequest('anId')],
      error: null,
      errors: []
    })
  })
})

describe('when reducing a FETCH_THIRD_PARTY_SUCCESS action', () => {
  beforeEach(() => {
    state = {
      ...state,
      loading: [fetchThirdPartyRequest('anId')],
      error: 'Some error'
    }
  })

  it('should remove the corresponding request action from the loading state, clear the error add the third party to the data', () => {
    expect(thirdPartyReducer(state, fetchThirdPartySuccess(thirdParty))).toEqual({
      ...INITIAL_STATE,
      data: {
        [thirdParty.id]: thirdParty
      },
      loading: [],
      error: null
    })
  })
})

describe('when reducing a FETCH_THIRD_PARTY_FAILURE action', () => {
  let error: string

  beforeEach(() => {
    error = 'anError'
    state = {
      ...state,
      loading: [fetchThirdPartyRequest('anId')],
      data: {}
    }
  })

  it('should remove the corresponding request action from the loading state and set the error', () => {
    expect(thirdPartyReducer(state, fetchThirdPartyFailure(error))).toEqual({
      ...INITIAL_STATE,
      loading: [],
      error
    })
  })
})

describe('when reducing a SET_THIRD_PARTY_TYPE_REQUEST action', () => {
  it('should add the action to the loading array', () => {
    expect(thirdPartyReducer(state, setThirdPartyKindRequest(thirdParty.id, true))).toEqual({
      ...INITIAL_STATE,
      loading: [setThirdPartyKindRequest(thirdParty.id, true)]
    })
  })
})

describe('when reducing a SET_THIRD_PARTY_TYPE_SUCCESS action', () => {
  beforeEach(() => {
    state = {
      ...state,
      data: {
        [thirdParty.id]: thirdParty
      },
      loading: [setThirdPartyKindRequest(thirdParty.id, true)],
      error: 'anError'
    }
  })

  it('should remove the corresponding request action from the loading state, clear the error and set the third party isProgrammatic property with the value given in the action', () => {
    expect(thirdPartyReducer(state, setThirdPartyKindSuccess(thirdParty.id, true))).toEqual({
      ...INITIAL_STATE,
      error: null,
      data: {
        ...state.data,
        [thirdParty.id]: {
          ...state.data[thirdParty.id],
          isProgrammatic: true
        }
      },
      loading: []
    })
  })
})

describe('when reducing a SET_THIRD_PARTY_TYPE_FAILURE action', () => {
  let error: string

  beforeEach(() => {
    error = 'anError'
    state = {
      ...state,
      error: null,
      loading: [setThirdPartyKindRequest(thirdParty.id, true)]
    }
  })

  it('should remove the corresponding request action from the loading state and set the error', () => {
    expect(thirdPartyReducer(state, setThirdPartyKindFailure(error))).toEqual({
      ...INITIAL_STATE,
      loading: [],
      error
    })
  })
})
