/**
 * Calculates the net balance for each member given a list of expenses.
 *
 * For every expense:
 *  - The payer (paidBy) is credited the full amount.
 *  - Each person in splitBetween is debited an equal share.
 *
 * @param {Array}  expenses - Array of expense objects from Firestore.
 * @param {Array}  members  - Array of member userId strings.
 * @returns {Object} balanceMap: { [userId]: number }
 *                   Positive → should receive money.
 *                   Negative → owes money.
 */
export const calculateBalances = (expenses, members) => {
  // Step 1: initialise everyone at zero
  const balances = {};
  members.forEach((uid) => {
    balances[uid] = 0;
  });

  // Step 2: process each expense
  for (const expense of expenses) {
    const { amount, paidBy, splitBetween } = expense;

    if (!amount || !paidBy || !Array.isArray(splitBetween) || splitBetween.length === 0) {
      continue; // skip malformed expense
    }

    const share = amount / splitBetween.length;

    // Credit the payer
    if (balances[paidBy] !== undefined) {
      balances[paidBy] += amount;
    }

    // Debit each participant
    for (const uid of splitBetween) {
      if (balances[uid] !== undefined) {
        balances[uid] -= share;
      }
    }
  }

  // Round to 2 decimal places to avoid floating-point drift
  for (const uid in balances) {
    balances[uid] = Math.round(balances[uid] * 100) / 100;
  }

  return balances;
};

/**
 * Simplifies a balance map into the minimum number of transactions
 * using a greedy creditor-debtor matching algorithm.
 *
 * @param {Object} balances - Output of calculateBalances().
 * @returns {Array} transactions: [{ from: userId, to: userId, amount: number }]
 */
export const simplifyDebts = (balances) => {
  const EPSILON = 0.01; // ignore rounding noise

  // Step 1: separate creditors (positive) and debtors (negative)
  const creditors = [];
  const debtors = [];

  for (const [uid, bal] of Object.entries(balances)) {
    if (bal > EPSILON) creditors.push({ uid, amount: bal });
    else if (bal < -EPSILON) debtors.push({ uid, amount: -bal }); // store as positive
  }

  // Step 2: sort descending so largest amounts are settled first
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];

  // Step 3: greedy matching
  let i = 0; // creditor pointer
  let j = 0; // debtor pointer

  while (i < creditors.length && j < debtors.length) {
    const creditor = creditors[i];
    const debtor = debtors[j];

    const settlement = Math.min(creditor.amount, debtor.amount);
    const rounded = Math.round(settlement * 100) / 100;

    if (rounded > EPSILON) {
      transactions.push({
        from: debtor.uid,
        to: creditor.uid,
        amount: rounded,
      });
    }

    creditor.amount -= settlement;
    debtor.amount -= settlement;

    if (creditor.amount < EPSILON) i++;
    if (debtor.amount < EPSILON) j++;
  }

  return transactions;
};
