import { shallowEqual, useDispatch, useSelector } from 'react-redux'
import { isLoadingType } from 'decentraland-dapps/dist/modules/loading/selectors'
import { getData as getWallet } from 'decentraland-dapps/dist/modules/wallet/selectors'
import { RootState } from 'modules/common/types'
import {
  getCollection,
  getLoading as getCollectionLoading,
  getUnsyncedCollectionError,
  getError as getCollectionError
} from 'modules/collection/selectors'
import {
  getLoading as getItemLoading,
  getCollectionItems,
  getError as getItemError,
  getRarities,
  getUnpublishedThirdPartyItemsById,
  getUnsyncedThirdPartyItemsById
} from 'modules/item/selectors'
import { publishCollectionRequest, PUBLISH_COLLECTION_REQUEST } from 'modules/collection/actions'
import { CREATE_COLLECTION_FORUM_POST_REQUEST } from 'modules/forum/actions'
import { fetchRaritiesRequest, FETCH_RARITIES_REQUEST, FETCH_ITEMS_REQUEST } from 'modules/item/actions'
import { getIsPublishCollectionsWertEnabled } from 'modules/features/selectors'
import { OwnProps } from './PublishWizardCollectionModal.types'
import PublishWizardCollectionModal from './PublishWizardCollectionModal'
import { useCallback, useMemo } from 'react'
import { isTPCollection } from 'modules/collection/utils'
import { PaymentMethod } from 'modules/collection/types'
import { Cheque } from 'modules/thirdParty/types'
import { publishAndPushChangesThirdPartyItemsRequest } from 'modules/thirdParty/actions'
import { getCollectionThirdParty, isPublishingAndPushingChanges, getError as getThirdPartyError } from 'modules/thirdParty/selectors'
import { useThirdPartyPrice } from './hooks'

export default (props: OwnProps) => {
  const dispatch = useDispatch()
  const { thirdPartyPrice, isFetchingPrice, fetchThirdPartyPrice } = useThirdPartyPrice()
  const collection = useSelector((state: RootState) => getCollection(state, props.metadata.collectionId), shallowEqual)!
  const isPublishLoading = useSelector(
    (state: RootState) => isLoadingType(getCollectionLoading(state), PUBLISH_COLLECTION_REQUEST),
    shallowEqual
  )
  const isPublishOrPushingThirdPartyItemsLoading = useSelector(isPublishingAndPushingChanges, shallowEqual)
  const isFetchingItems = useSelector((state: RootState) => isLoadingType(getItemLoading(state), FETCH_ITEMS_REQUEST), shallowEqual)
  const isFetchingRarities = useSelector((state: RootState) => isLoadingType(getItemLoading(state), FETCH_RARITIES_REQUEST), shallowEqual)
  const isCreatingForumPost = useSelector(
    (state: RootState) => isLoadingType(getCollectionLoading(state), CREATE_COLLECTION_FORUM_POST_REQUEST),
    shallowEqual
  )
  const isPublishCollectionsWertEnabled = useSelector(getIsPublishCollectionsWertEnabled, shallowEqual)
  const wallet = useSelector(getWallet, shallowEqual)!
  const unsyncedCollectionError = useSelector(getUnsyncedCollectionError, shallowEqual)
  const allCollectionItems = useSelector((state: RootState) => getCollectionItems(state, props.metadata.collectionId), shallowEqual)
  const rarities = useSelector(getRarities, shallowEqual)
  const itemError = useSelector(getItemError, shallowEqual)
  const collectionError = useSelector(getCollectionError, shallowEqual)
  const thirdPartyPublishingError = useSelector(getThirdPartyError, shallowEqual)
  const isThirdParty = useMemo(() => collection && isTPCollection(collection), [collection])
  const thirdParty = useSelector(
    (state: RootState) => (collection && isThirdParty ? getCollectionThirdParty(state, collection) : undefined),
    shallowEqual
  )

  const itemIdsToPublish = useMemo(() => (props.metadata.itemsToPublish ?? []).map(item => item.id), [props.metadata.itemsToPublish])
  const thirdPartyItemsToPublish = useSelector(
    (state: RootState) => getUnpublishedThirdPartyItemsById(state, itemIdsToPublish),
    shallowEqual
  )
  const thirdPartyItemsToPushChanges = useSelector(
    (state: RootState) =>
      getUnsyncedThirdPartyItemsById(
        state,
        (props.metadata.itemsToPublish ?? []).map(item => item.id)
      ),
    shallowEqual
  )

  const itemsToPublish = isThirdParty ? thirdPartyItemsToPublish : allCollectionItems
  const itemsWithChanges = thirdPartyItemsToPushChanges

  const price = useMemo(() => {
    if (isThirdParty) {
      return thirdPartyPrice
    } else if (rarities[0]?.prices?.USD && rarities[0]?.prices?.MANA) {
      // The UI is designed in a way that considers that all rarities have the same price, so only using the first one
      // as reference for the prices is enough.
      return { item: { usd: rarities[0].prices.USD, mana: rarities[0].prices.MANA } }
    }
  }, [thirdPartyPrice, rarities[0]?.prices?.USD, rarities[0]?.prices?.MANA])

  const onFetchRarities = useCallback(() => dispatch(fetchRaritiesRequest()), [dispatch, fetchRaritiesRequest])

  const onPublish = useCallback(
    (email: string, subscribeToNewsletter: boolean, paymentMethod: PaymentMethod, cheque?: Cheque, maxSlotPrice?: string) => {
      return isThirdParty
        ? thirdParty &&
            dispatch(
              publishAndPushChangesThirdPartyItemsRequest(
                thirdParty,
                itemsToPublish,
                itemsWithChanges,
                cheque,
                email,
                subscribeToNewsletter,
                maxSlotPrice
              )
            )
        : dispatch(publishCollectionRequest(collection, itemsToPublish, email, subscribeToNewsletter, paymentMethod))
    },
    [
      isThirdParty,
      thirdParty,
      collection,
      itemsToPublish,
      itemsWithChanges,
      dispatch,
      publishAndPushChangesThirdPartyItemsRequest,
      publishCollectionRequest
    ]
  )

  const isPublishingFinished = !!collection.forumLink && thirdPartyItemsToPublish.length === 0 && thirdPartyItemsToPushChanges.length === 0

  return (
    <PublishWizardCollectionModal
      {...props}
      collection={collection}
      isLoading={
        isPublishLoading ||
        isFetchingItems ||
        isFetchingRarities ||
        isCreatingForumPost ||
        isFetchingPrice ||
        isPublishOrPushingThirdPartyItemsLoading ||
        !!collection.lock
      }
      wallet={wallet}
      itemsToPublish={itemsToPublish}
      itemsWithChanges={itemsWithChanges}
      isPublishingFinished={isPublishingFinished}
      price={price}
      unsyncedCollectionError={unsyncedCollectionError}
      itemError={itemError}
      collectionError={collectionError || thirdPartyPublishingError}
      isPublishCollectionsWertEnabled={isPublishCollectionsWertEnabled}
      onPublish={onPublish}
      onFetchPrice={isThirdParty ? fetchThirdPartyPrice : onFetchRarities}
    />
  )
}
