import { Land } from 'modules/land/types'
import { Deployment } from 'modules/deployment/types'

export type Props = {
  className?: string
  children: (land: Land, deployments: Deployment[]) => React.ReactNode
}
