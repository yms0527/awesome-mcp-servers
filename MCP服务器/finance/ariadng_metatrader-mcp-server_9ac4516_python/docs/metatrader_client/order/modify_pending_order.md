# ✏️ modify_pending_order

**Signature:**
```python
def modify_pending_order(connection, *, id: Union[int, str], price: Optional[Union[int, float]] = None, stop_loss: Optional[Union[int, float]] = None, take_profit: Optional[Union[int, float]] = None)
```

## What does it do? 🔧
Modifies an existing pending order’s price, stop loss, or take profit. Super useful for adjusting your strategy on the fly!

## Parameters
- **connection**: MetaTrader 5 connection object
- **id**: Order ID
- **price**: (Optional) New price
- **stop_loss**: (Optional) Stop loss
- **take_profit**: (Optional) Take profit

## Returns
- Dictionary with error flag, message, and modified order data

## Fun Fact 🛠️
Fine-tune your trades for maximum flexibility!
