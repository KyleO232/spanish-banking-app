// Admin mode lets a verified admin open every lesson and step without unlocking.
// The effective flag is set by AuthProvider (only after the database confirms
// the signed-in user is an admin); the on/off preference is just a convenience.

const PREF_KEY = 'spanish-banking-admin-pref';

let effective = false;

export function isAdminMode() {
  return effective;
}

export function setAdminEffective(value) {
  effective = Boolean(value);
}

export function getAdminPreference() {
  try {
    return localStorage.getItem(PREF_KEY) !== 'off';
  } catch {
    return true;
  }
}

export function saveAdminPreference(on) {
  try {
    localStorage.setItem(PREF_KEY, on ? 'on' : 'off');
  } catch {
    // ignore
  }
}
