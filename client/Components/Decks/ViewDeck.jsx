import React from 'react';
import PropTypes from 'prop-types';

import ConfirmedButton from '../Form/ConfirmedButton';
import DeckSummary from './DeckSummary';
import Panel from '../Site/Panel';

import { withTranslation, Trans } from 'react-i18next';

class ViewDeck extends React.Component {
    constructor() {
        super();

        this.handleDeleteClick = this.handleDeleteClick.bind(this);
        this.handleEditClick = this.handleEditClick.bind(this);
    }

    handleDeleteClick(event) {
        event.preventDefault();
        this.props.onDeleteDeck(this.props.deck);
    }

    handleEditClick(event) {
        event.preventDefault();
        this.setState({ deck: this.props.deck });
    }

    render() {
        let { deck, cards } = this.props;

        return (
            <div className='col-md-6'>
                <Panel title={ deck.name }>
                    <div className='btn-group col-xs-12'>
                        <ConfirmedButton onClick={ this.handleDeleteClick }><Trans>Delete</Trans></ConfirmedButton>
                        <button onClick={ this.handleEditClick } className='btn btn-success'><Trans>Edit</Trans></button>
                    </div>
                    <DeckSummary deck={ deck } cards={ cards } />
                </Panel>
            </div>);
    }
}

ViewDeck.propTypes = {
    cards: PropTypes.object,
    deck: PropTypes.object.isRequired,
    i18n: PropTypes.object,
    onDeleteDeck: PropTypes.func.isRequired,
    onEditDeck: PropTypes.func.isRequired,
    t: PropTypes.func
};

export default withTranslation()(ViewDeck);
