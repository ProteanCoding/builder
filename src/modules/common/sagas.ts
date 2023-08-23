import { all } from 'redux-saga/effects'
import { CatalystClient } from 'dcl-catalyst-client'
import { BuilderClient } from '@dcl/builder-client'
import { ApplicationName } from 'decentraland-dapps/dist/modules/features/types'

import { createProfileSaga } from 'decentraland-dapps/dist/modules/profile/sagas'
import { transactionSaga } from 'decentraland-dapps/dist/modules/transaction/sagas'
import { authorizationSaga } from 'decentraland-dapps/dist/modules/authorization/sagas'
import { toastSaga } from 'decentraland-dapps/dist/modules/toast/sagas'
import { featuresSaga } from 'decentraland-dapps/dist/modules/features/sagas'

import { analyticsSaga } from 'modules/analytics/sagas'
import { assetPackSaga } from 'modules/assetPack/sagas'
import { assetSaga } from 'modules/asset/sagas'
import { collectionSaga } from 'modules/collection/sagas'
import { committeeSaga } from 'modules/committee/sagas'
import { deploymentSaga } from 'modules/deployment/sagas'
import { editorSaga } from 'modules/editor/sagas'
import { ensSaga } from 'modules/ens/sagas'
import { forumSaga } from 'modules/forum/sagas'
import { identitySaga } from 'modules/identity/sagas'
import { itemSaga } from 'modules/item/sagas'
import { keyboardSaga } from 'modules/keyboard/sagas'
import { landSaga } from 'modules/land/sagas'
import { locationSaga } from 'modules/location/sagas'
import { mediaSaga } from 'modules/media/sagas'
import { modalSaga } from 'modules/modal/sagas'
import { poolGroupSaga } from 'modules/poolGroup/sagas'
import { poolSaga } from 'modules/pool/sagas'
import { projectSaga } from 'modules/project/sagas'
import { sceneSaga } from 'modules/scene/sagas'
import { statsSaga } from 'modules/stats/sagas'
import { syncSaga } from 'modules/sync/sagas'
import { thirdPartySaga } from 'modules/thirdParty/sagas'
import { tileSaga } from 'modules/tile/sagas'
import { translationSaga } from 'modules/translation/sagas'
import { uiSaga } from 'modules/ui/sagas'
import { walletSaga } from 'modules/wallet/sagas'
import { PEER_URL } from 'lib/api/peer'
import { BuilderAPI } from 'lib/api/builder'
import { entitySaga } from 'modules/entity/sagas'
import { collectionCurationSaga } from 'modules/curations/collectionCuration/sagas'
import { getPeerWithNoGBCollectorURL } from './utils'
import { itemCurationSaga } from 'modules/curations/itemCuration/sagas'
import { inspectorSaga } from 'modules/inspector/sagas'
import { RootStore } from './types'

const profileSaga = createProfileSaga({ peerUrl: PEER_URL, peerWithNoGbCollectorUrl: getPeerWithNoGBCollectorURL() })

export function* rootSaga(builderAPI: BuilderAPI, newBuilderClient: BuilderClient, catalystClient: CatalystClient, store: RootStore) {
  yield all([
    analyticsSaga(),
    assetPackSaga(builderAPI),
    assetSaga(newBuilderClient),
    authorizationSaga(),
    collectionSaga(builderAPI, newBuilderClient),
    committeeSaga(builderAPI),
    deploymentSaga(builderAPI, catalystClient),
    editorSaga(),
    ensSaga(newBuilderClient),
    entitySaga(catalystClient),
    forumSaga(builderAPI),
    identitySaga(),
    itemSaga(builderAPI, newBuilderClient),
    keyboardSaga(),
    landSaga(),
    locationSaga(),
    mediaSaga(),
    modalSaga(),
    poolGroupSaga(builderAPI),
    poolSaga(builderAPI),
    profileSaga(),
    projectSaga(builderAPI),
    sceneSaga(builderAPI),
    statsSaga(),
    syncSaga(builderAPI),
    thirdPartySaga(builderAPI, catalystClient),
    tileSaga(),
    toastSaga(),
    transactionSaga(),
    translationSaga(),
    uiSaga(),
    walletSaga(),
    collectionCurationSaga(builderAPI),
    itemCurationSaga(builderAPI),
    featuresSaga({ polling: { apps: [ApplicationName.BUILDER], delay: 60000 /** 60 seconds */ } }),
    inspectorSaga(builderAPI, store)
  ])
}
