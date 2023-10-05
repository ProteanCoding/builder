import { expectSaga } from 'redux-saga-test-plan'
import { call } from 'redux-saga/effects'
import { throwError } from 'redux-saga-test-plan/providers'
import { connectWalletSuccess } from 'decentraland-dapps/dist/modules/wallet/actions'
import { Wallet } from 'decentraland-dapps/dist/modules/wallet/types'
import { WorldsWalletStats, content } from 'lib/api/worlds'
import { fetchWorldsWalletStatsFailure, fetchWorldsWalletStatsRequest, fetchWorldsWalletStatsSuccess } from './actions'
import { worldsSaga } from './sagas'

let address: string

beforeEach(() => {
  address = '0x123'
})

describe('when handling the request action to fetch worlds stats for a wallet', () => {
  describe('when the worlds api request throws an error', () => {
    let error: Error

    beforeEach(() => {
      error = new Error('some error')
    })

    it('should put the failure action with the request action address and the error message', () => {
      return expectSaga(worldsSaga)
        .provide([[call([content, content.fetchWalletStats], address), throwError(error)]])
        .put(fetchWorldsWalletStatsFailure(address, error.message))
        .dispatch(fetchWorldsWalletStatsRequest(address))
        .silentRun()
    })
  })

  describe('when the worlds api request returns null', () => {
    it('should put the failure action with the request action address and the error message', () => {
      return expectSaga(worldsSaga)
        .provide([[call([content, content.fetchWalletStats], address), null]])
        .put(fetchWorldsWalletStatsFailure(address, 'Could not fetch wallet stats'))
        .dispatch(fetchWorldsWalletStatsRequest(address))
        .silentRun()
    })
  })

  describe('when the worlds api request returns the stats', () => {
    let stats: WorldsWalletStats

    beforeEach(() => {
      stats = {
        dclNames: [],
        ensNames: [],
        maxAllowedSpace: '',
        usedSpace: '',
        wallet: address
      }
    })

    it('should put the success action with the request action address and the stats', () => {
      return expectSaga(worldsSaga)
        .provide([[call([content, content.fetchWalletStats], address), stats]])
        .put(fetchWorldsWalletStatsSuccess(address, stats))
        .dispatch(fetchWorldsWalletStatsRequest(address))
        .silentRun()
    })
  })
})

describe('when the wallet connects', () => {
  it('should put the action to fetch worlds stats for the connected wallet address', () => {
    return expectSaga(worldsSaga)
      .put(fetchWorldsWalletStatsRequest(address))
      .dispatch(connectWalletSuccess({ address } as Wallet))
      .silentRun()
  })
})