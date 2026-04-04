import {
  collection,
  doc,
  addDoc,
  getDocs,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import { getGroupMembers } from './groupService.js';
import { calculateBalances, simplifyDebts } from '../utils/splitLogic.js';

// ─── helpers ─────────────────────────────────────────────────────────────────
const expensesRef = (groupId) => collection(db, 'groups', groupId, 'expenses');

const assertAuth = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to perform this action.');
  return user;
};

// ─────────────────────────────────────────────────────────────────────────────
// ADD EXPENSE
// ─────────────────────────────────────────────────────────────────────────────
/**
 * @param {string} groupId
 * @param {Object} expenseData
 * @param {string} expenseData.description
 * @param {number} expenseData.amount        - Total amount paid
 * @param {string} expenseData.paidBy        - userId of payer
 * @param {Array}  expenseData.splitBetween  - Array of userIds to split among
 */
export const addExpense = async (groupId, expenseData) => {
  try {
    const user = assertAuth();

    const { description, amount, paidBy, splitBetween } = expenseData;

    // ── Validation ────────────────────────────────────────────────────────
    if (!description?.trim()) return { success: false, error: 'Description is required.' };
    if (!amount || isNaN(amount) || Number(amount) <= 0)
      return { success: false, error: 'Amount must be a positive number.' };
    if (!paidBy) return { success: false, error: 'paidBy (userId) is required.' };
    if (!Array.isArray(splitBetween) || splitBetween.length === 0)
      return { success: false, error: 'splitBetween must be a non-empty array of userIds.' };

    const parsedAmount = Math.round(Number(amount) * 100) / 100;
    const share = Math.round((parsedAmount / splitBetween.length) * 100) / 100;

    const expense = {
      description: description.trim(),
      amount: parsedAmount,
      sharePerPerson: share,
      paidBy,
      splitBetween,
      addedBy: user.uid,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(expensesRef(groupId), expense);

    return {
      success: true,
      data: { expenseId: docRef.id, ...expense },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET EXPENSES
// Returns all expenses for a group, sorted by creation time (oldest first).
// ─────────────────────────────────────────────────────────────────────────────
export const getExpenses = async (groupId) => {
  try {
    assertAuth();

    const q = query(expensesRef(groupId), orderBy('createdAt', 'asc'));
    const snap = await getDocs(q);

    const expenses = snap.docs.map((d) => ({ expenseId: d.id, ...d.data() }));

    return { success: true, data: expenses };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REAL-TIME LISTENER — subscribe to expenses
// Returns the unsubscribe function; caller must invoke it on cleanup.
// ─────────────────────────────────────────────────────────────────────────────
export const subscribeToExpenses = (groupId, callback) => {
  const q = query(expensesRef(groupId), orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snap) => {
    const expenses = snap.docs.map((d) => ({ expenseId: d.id, ...d.data() }));
    callback({ success: true, data: expenses });
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// GET GROUP SETTLEMENT
// Orchestrates: fetch members → fetch expenses → calculate → simplify
// ─────────────────────────────────────────────────────────────────────────────
export const getGroupSettlement = async (groupId) => {
  try {
    assertAuth();

    // 1. Fetch members
    const membersResult = await getGroupMembers(groupId);
    if (!membersResult.success) return membersResult;
    const members = membersResult.data;

    // 2. Fetch expenses
    const expensesResult = await getExpenses(groupId);
    if (!expensesResult.success) return expensesResult;
    const expenses = expensesResult.data;

    if (expenses.length === 0) {
      return {
        success: true,
        data: {
          balances: members.reduce((acc, uid) => ({ ...acc, [uid]: 0 }), {}),
          transactions: [],
          message: 'No expenses to settle.',
        },
      };
    }

    // 3. Calculate balances
    const balances = calculateBalances(expenses, members);

    // 4. Simplify debts
    const transactions = simplifyDebts(balances);

    return {
      success: true,
      data: { balances, transactions },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
