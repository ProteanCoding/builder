import { connect } from 'react-redux'

import { RootState, Vector3 } from 'modules/common/types'
import { getCategories } from 'modules/ui/sidebar/selectors'
import { addAsset } from 'modules/scene/actions'
import { AssetResource } from 'modules/asset/types'
import { isLoading } from 'modules/assetPack/selectors'
import { MapStateProps, MapDispatchProps, MapDispatch } from './SideBar.types'
import SideBar from './SideBar'

const mapState = (state: RootState): MapStateProps => ({
  categories: getCategories(state),
  isLoading: isLoading(state)
})

const mapDispatch = (dispatch: MapDispatch): MapDispatchProps => ({
  onAddAsset: (asset: AssetResource, position: Vector3) => dispatch(addAsset(asset, position))
})

export default connect(
  mapState,
  mapDispatch
)(SideBar)
