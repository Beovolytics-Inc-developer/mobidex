import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { pop, push, showModal } from '../../../../navigation';
import { styles } from '../../../../styles';
import {
  formatProduct,
  isValidAmount,
  processVirtualKeyboardCharacter
} from '../../../../utils';
import FullScreen from '../../../components/FullScreen';
import TokenAmountKeyboard from '../../../components/TokenAmountKeyboard';
import TokenAmount from '../../../components/TokenAmount';
import OrderbookPrice from '../../../views/OrderbookPrice';

export default class FillOrders extends PureComponent {
  static get propTypes() {
    return {
      side: PropTypes.string.isRequired,
      base: PropTypes.object.isRequired,
      quote: PropTypes.object.isRequired
    };
  }

  constructor(props) {
    super(props);

    this.state = {
      amount: ''
    };
  }

  render() {
    return (
      <FullScreen>
        <TokenAmount
          containerStyle={[styles.flex4, styles.mv2, styles.mr2, styles.p0]}
          symbol={this.props.base.symbol}
          label={side === 'buy' ? 'Buying' : 'Selling'}
          amount={this.state.amount.toString()}
          cursor={true}
          cursorProps={{ style: { marginLeft: 2 } }}
          format={false}
        />
        <TokenAmount
          label={'price'}
          amount={
            <OrderbookPrice
              product={formatProduct(
                this.props.base.symbol,
                this.props.quote.symbol
              )}
              default={0}
              side={this.props.side}
            />
          }
          format={false}
          symbol={this.props.quote.symbol}
        />
        <TokenAmountKeyboard
          onChange={this.onSetAmount}
          onSubmit={this.onSubmit}
          pressMode="char"
          buttonTitle={this.renderButtonTitle()}
          disableButton={
            this.state.amount === '' || !isValidAmount(this.state.amount)
          }
        />
      </FullScreen>
    );
  }

  renderButtonTitle = () => {
    if (this.props.side === 'buy') {
      return 'Preview Buy Order';
    } else {
      return 'Preview Sell Order';
    }
  };

  onSubmit = () => {
    const { amount } = this.state;

    if (isValidAmount(amount)) {
      const { side, base, quote } = this.props;

      showModal('modals.PreviewOrder', {
        type: 'fill',
        side,
        amount,
        base,
        quote
      });
    }
  };

  onSetAmount = value => {
    const text = processVirtualKeyboardCharacter(
      value,
      this.state.amount.toString()
    );

    if (isValidAmount(text)) {
      this.setState({ amount: text, amountError: false });
    }
  };
}