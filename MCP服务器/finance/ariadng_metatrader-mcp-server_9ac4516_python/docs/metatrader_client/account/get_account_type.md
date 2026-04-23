# get_account_type 🏷️

## What does it do?
Returns the account type: "real", "demo", or "contest".

## Parameters
- `connection`: The MetaTrader connection object (must be connected!).

## Returns
- `str`: Account type ("real", "demo", or "contest").

## Raises
- `AccountInfoError`: If account type can't be retrieved.
- `ConnectionError`: If not connected to the terminal.

## Example
```python
acc_type = get_account_type(connection)
print(f"Account type: {acc_type} 🏷️")
```

---

> **Heads up:** Know your account type before you trade for real! 🧐
