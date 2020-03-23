import React from 'react';
import PropTypes from 'prop-types';
import Panel from '../Components/Site/Panel';

import { withTranslation, Trans } from 'react-i18next';

class Community extends React.Component {
    render() {
        let t = this.props.t;

        return (
            <div className='col-xs-12 full-height'>
                <Panel title={ t('Manacrest Online - Community Information') }>
                    <h3><Trans>What is this page?</Trans></h3>
                    <p><Trans i18nKey='community.whatisthis'>This page is a shoutout to other works/resources in the Manacrest community.</Trans></p>

                    <h3>Manacrest Discord</h3>
                    <Trans i18nKey='community.discord'>
                        <p>Link: <a href='https://manacrest.com/discord' target='_blank' rel='noopener noreferrer'>Manacrest Discord</a></p>
                        <p>Discord is a text and voice communicaton application.</p>
                    </Trans>
                    
                    <h3>Manacrest Subreddit</h3>
                    <Trans i18nKey='community.discord'>
                        <p>Link: <a href='https://reddit.com/r/manacrest' target='_blank' rel='noopener noreferrer'>/r/Manacrest Subreddit</a></p>
                        <p>Reddit is a community message board.</p>
                    </Trans>
                </Panel>
            </div>
        );
    }
}

Community.displayName = 'Community';
Community.propTypes = {
    i18n: PropTypes.object,
    t: PropTypes.func
};

export default withTranslation()(Community);
