import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebase.js';
import { generateToken } from '../utils/generateToken.js';

// ─── helpers ─────────────────────────────────────────────────────────────────

const groupRef = (groupId) => doc(db, 'groups', groupId);

const assertAuth = () => {
  const user = auth.currentUser;
  if (!user) throw new Error('You must be logged in to perform this action.');
  return user;
};

const assertLeader = (group, uid) => {
  if (group.leaderId !== uid) throw new Error('Only the group leader can perform this action.');
};

// ─────────────────────────────────────────────────────────────────────────────
// CREATE GROUP
// ─────────────────────────────────────────────────────────────────────────────
export const createGroup = async (name, maxMembers = 10) => {
  try {
    const user = assertAuth();

    if (!name?.trim()) return { success: false, error: 'Group name is required.' };
    if (maxMembers < 2) return { success: false, error: 'A group needs at least 2 members.' };

    const inviteToken = generateToken();
    const groupId = `group_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

    const groupData = {
      groupId,
      name: name.trim(),
      maxMembers: Number(maxMembers),
      leaderId: user.uid,
      members: [user.uid],                  // leader is always the first member
      pendingRequests: [],
      inviteToken,
      createdAt: serverTimestamp(),
    };

    await setDoc(groupRef(groupId), groupData);

    return { success: true, data: { ...groupData, groupId } };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GENERATE / REGENERATE INVITE LINK
// ─────────────────────────────────────────────────────────────────────────────
export const generateInviteLink = (groupId, token) => {
  const base = window.location.origin;
  return `${base}/join-group/${groupId}/${token}`;
};

export const regenerateInviteLink = async (groupId) => {
  try {
    const user = assertAuth();
    const snap = await getDoc(groupRef(groupId));

    if (!snap.exists()) return { success: false, error: 'Group not found.' };

    assertLeader(snap.data(), user.uid);

    const newToken = generateToken();
    await updateDoc(groupRef(groupId), { inviteToken: newToken });

    return {
      success: true,
      data: {
        inviteToken: newToken,
        inviteLink: generateInviteLink(groupId, newToken),
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATE INVITE LINK
// ─────────────────────────────────────────────────────────────────────────────
export const validateInviteLink = async (groupId, token) => {
  try {
    const snap = await getDoc(groupRef(groupId));
    if (!snap.exists()) return { success: false, error: 'Group not found.' };

    const group = snap.data();
    if (group.inviteToken !== token) return { success: false, error: 'Invalid or expired invite link.' };

    return { success: true, data: group };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST TO JOIN
// ─────────────────────────────────────────────────────────────────────────────
export const requestToJoin = async (groupId, token) => {
  try {
    const user = assertAuth();

    const validation = await validateInviteLink(groupId, token);
    if (!validation.success) return validation;

    const group = validation.data;

    // Already a member?
    if (group.members.includes(user.uid)) {
      return { success: false, error: 'You are already a member of this group.' };
    }

    // Group full?
    if (group.members.length >= group.maxMembers) {
      return { success: false, error: 'This group is full.' };
    }

    // Already has a pending request?
    const alreadyPending = group.pendingRequests?.some((r) => r.userId === user.uid);
    if (alreadyPending) {
      return { success: false, error: 'Your join request is already pending.' };
    }

    const request = {
      requestId: `req_${Date.now()}`,
      userId: user.uid,
      email: user.email,
      requestedAt: new Date().toISOString(),
    };

    await updateDoc(groupRef(groupId), {
      pendingRequests: arrayUnion(request),
    });

    return { success: true, data: request };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// APPROVE REQUEST
// ─────────────────────────────────────────────────────────────────────────────
export const approveRequest = async (groupId, requestId) => {
  try {
    const user = assertAuth();
    const snap = await getDoc(groupRef(groupId));

    if (!snap.exists()) return { success: false, error: 'Group not found.' };

    const group = snap.data();
    assertLeader(group, user.uid);

    const request = group.pendingRequests?.find((r) => r.requestId === requestId);
    if (!request) return { success: false, error: 'Request not found.' };

    // Enforce max members
    if (group.members.length >= group.maxMembers) {
      return { success: false, error: 'Group is full. Cannot approve.' };
    }

    await updateDoc(groupRef(groupId), {
      members: arrayUnion(request.userId),
      pendingRequests: arrayRemove(request),
    });

    return { success: true, data: { approvedUserId: request.userId } };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REJECT REQUEST
// ─────────────────────────────────────────────────────────────────────────────
export const rejectRequest = async (groupId, requestId) => {
  try {
    const user = assertAuth();
    const snap = await getDoc(groupRef(groupId));

    if (!snap.exists()) return { success: false, error: 'Group not found.' };

    const group = snap.data();
    assertLeader(group, user.uid);

    const request = group.pendingRequests?.find((r) => r.requestId === requestId);
    if (!request) return { success: false, error: 'Request not found.' };

    await updateDoc(groupRef(groupId), {
      pendingRequests: arrayRemove(request),
    });

    return { success: true, data: { rejectedUserId: request.userId } };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET GROUP MEMBERS
// ─────────────────────────────────────────────────────────────────────────────
export const getGroupMembers = async (groupId) => {
  try {
    assertAuth();
    const snap = await getDoc(groupRef(groupId));

    if (!snap.exists()) return { success: false, error: 'Group not found.' };

    const { members } = snap.data();
    return { success: true, data: members };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REAL-TIME LISTENER — subscribe to group changes
// Returns the unsubscribe function; caller must invoke it on cleanup.
// ─────────────────────────────────────────────────────────────────────────────
export const subscribeToGroup = (groupId, callback) => {
  return onSnapshot(groupRef(groupId), (snap) => {
    if (snap.exists()) {
      callback({ success: true, data: snap.data() });
    } else {
      callback({ success: false, error: 'Group not found.' });
    }
  });
};
