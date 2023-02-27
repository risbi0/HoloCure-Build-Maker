import { writable } from 'svelte/store';

export const charSelected = writable('Amelia Watson');
/// choices
export const displayChoices = writable(false);
export const displayWeaponChoices = writable(false);
export const displayItemChoices = writable(false);
export const displayStampChoices = writable(false);
export const displayStatChoices = writable(false);
// add symbols
export const weaponAddSymbols = writable(Array(5).fill('add'));
export const itemAddSymbols = writable(Array(6).fill('add'));
export const stampAddSymbols = writable(Array(3).fill('add'));
// active gear
export const equippedWeapons = writable(Array(5).fill(''));
export const equippedItems = writable(Array(6).fill(''));
export const equippedStamps = writable(Array(3).fill(''));
// remove gear
export const removeWeapon = writable(false);
export const removeItem = writable(false);
export const removeStamp = writable(false);
// display toggle
export const showBuildName = writable(false);
export const showStamps = writable(true);
// reset slots
export const resetWeaponSlots = writable(false);
export const resetItemSlots = writable(false);
export const resetStampSlots = writable(false);
// misc
export const buildName = writable('Build Name');
export const collabLimit = writable(4);
export const weaponSlots = writable(6);
export const clickedSlotIndex = writable(null);
export const statPriorityOrder = writable([]);
export const showPriorityOrder = writable(false);