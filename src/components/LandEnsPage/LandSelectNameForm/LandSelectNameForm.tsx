import * as React from 'react'
import { Form, Row, Button, Section, Header, Dropdown, DropdownProps } from 'decentraland-ui'
import { t, T } from 'decentraland-dapps/dist/modules/translation/utils'
import { Link } from 'react-router-dom'
import { locations } from 'routing/locations'
import { findBySubdomain, isEqualContent } from 'modules/ens/utils'
import { Props, State } from './LandSelectNameForm.types'
import './LandSelectNameForm.css'

export default class LandSelectNameForm extends React.PureComponent<Props, State> {
  state: State = {
    selectedSubdomain: ''
  }

  handleChange = (_: React.SyntheticEvent, data: DropdownProps) => {
    const { onFetchENS, land } = this.props
    const selectedSubdomain = data.value as string
    onFetchENS(selectedSubdomain, land)
    this.setState({ selectedSubdomain })
  }

  handleContinue = () => {
    const { selectedSubdomain } = this.state
    const { onUpdateSubdomain } = this.props
    onUpdateSubdomain(selectedSubdomain)
  }

  render() {
    const { land, ensList, isLoading } = this.props
    const { selectedSubdomain } = this.state

    const selectOptions = ensList.map(({ subdomain }) => ({ value: subdomain.toLowerCase(), text: subdomain.toLowerCase() }))
    const selectedENS = findBySubdomain(ensList, selectedSubdomain)

    const isButtonDisabled: boolean = !selectedENS || isEqualContent(selectedENS, land)

    return (
      <Form className="LandSelectNameForm">
        {!isLoading && selectOptions.length === 0 ? (
          <>
            <Section size="large">{t('land_ens_page.empty_options_message')}</Section>
            <Row>
              <Link className="cancel" to={locations.landDetail(land.id)}>
                <Button>{t('global.cancel')}</Button>
              </Link>
              <Link to={locations.claimName()}>
                <Button primary>{t('land_ens_page.claim_new_name')}</Button>
              </Link>
            </Row>
          </>
        ) : (
          <>
            <Section size="large">
              <div className="select-names">
                <Header sub className="name">
                  {t('land_ens_page.select_names.title')}
                </Header>
                <Dropdown
                  value={selectedSubdomain}
                  options={selectOptions}
                  placeholder={t('land_ens_page.select_names.placeholder')}
                  onChange={this.handleChange}
                />
              </div>

              <div className="select-message">
                {selectedENS && isEqualContent(selectedENS, land) ? (
                  <span className="danger-text">{t('land_ens_page.select_names.message.name_assigned')}</span>
                ) : (
                  <T
                    id="land_ens_page.select_names.message.click_to_claim_new_name"
                    values={{
                      click_here: <Link to={locations.claimName()}>{t('global.click_here')}</Link>
                    }}
                  />
                )}
              </div>
            </Section>
            <Row>
              <Link className="cancel" to={locations.landDetail(land.id)}>
                <Button>{t('global.cancel')}</Button>
              </Link>
              <Button type="submit" disabled={isButtonDisabled || isLoading} primary onClick={this.handleContinue} loading={isLoading}>
                {t('global.continue')}
              </Button>
            </Row>
          </>
        )}
      </Form>
    )
  }
}