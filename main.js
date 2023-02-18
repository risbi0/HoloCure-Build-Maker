import html2canvas from 'html2canvas';
import FileSaver from 'file-saver';

const collabForumlas = {
    'absolute-wall': ['bounce-ball', 'cutting-board'],
    'bl-fujoshi': ['bl-book', 'sui-axe'],
    'bone-bros': ['cutting-board', 'ens-curse'],
    'breathe-in-asacoco': ['holo-bomb', 'plug-in-asacoco'],
    'broken-dreams': ['chama-cooking', 'ceos-tears'],
    'dragon-fire': ['fan-beam', 'plug-in-asacoco'],
    'eldritch-horror': ['chama-cooking', 'ens-curse'],
    'elite-cooking': ['chama-cooking', 'lava-bucket'],
    'flattening-board': ['cutting-board', 'holo-bomb'],
    'frozen-sea': ['bl-book', 'wamy-water'],
    'im-die-ty-4eva': ['holo-bomb', 'x-potato'],
    'idol-concert': ['glowstick', 'idol-song'],
    'light-beam': ['fan-beam', 'glowstick'],
    'micomet': ['lava-bucket', 'sui-axe'],
    'mikorone': ['lava-bucket', 'x-potato'],
    'rap-dog': ['idol-song', 'x-potato'],
    'ring-of-fitness': ['bounce-ball', 'ceos-tears'],
    'snow-sake': [ 'glowstick', 'wamy-water'],
    'stream-of-tears': ['ceos-tears', 'fan-beam']
}
const weaponsClassNames = [
    'bl-book', 'bounce-ball', 'ceos-tears', 'cutting-board', 'lava-bucket',
    'ens-curse', 'fan-beam', 'glowstick', 'holo-bomb', 'idol-song',
    'plug-in-asacoco', 'sui-axe', 'chama-cooking', 'wamy-water', 'x-potato',
    'absolute-wall', 'bl-fujoshi', 'bone-bros', 'breathe-in-asacoco', 'broken-dreams',
    'dragon-fire', 'eldritch-horror', 'elite-cooking', 'flattening-board', 'frozen-sea', 
    'im-die-ty-4eva', 'idol-concert', 'light-beam', 'micomet', 'mikorone',
    'rap-dog', 'ring-of-fitness', 'snow-sake', 'stream-of-tears'
];
const basicWeapLength = 15;
const basicWeapons = weaponsClassNames.slice(0, basicWeapLength);
const collabWeapons = weaponsClassNames.slice(basicWeapLength, weaponsClassNames.length);

const itemsClassNames = [
    'blacksmiths-gear', 'body-pillow', 'breastplate', 'chickens-feather', 'credit-card',
    'devil-hat', 'energy-drink', 'face-mask', 'full-meal', 'gorillas-paw',
    'gws-pill', 'halu', 'headphones', 'hope-sode', 'idol-costume',
    'injection-type-asacoco', 'just-bandage', 'milk', 'shackles', 'limiter',
    'membership', 'horn', 'ppp', 'plushie', 'sake',
    'piggy-bank', 'glasses', 'sc-time', 'uber-sheep'
];

const stampsClassNames = [
    'atk', 'bomb', 'crit', 'greed', 'haste', 'knockback', 'life-steal', 'projectile',
    'reverse', 'rgb', 'size', 'slow', 'solo', 'stun', 'trumpet', 'weaken'
];

// character selection
const charSelect = document.querySelector('#char-select');
const charImage = document.querySelector('#character #img');
const defaultWeapon = document.querySelector('#default-weap .img');
charSelect.addEventListener('change', (e) => {
    // change image and starting weapon based on selection
    charImage.className = '';
    charImage.classList.add(e.target.value);
    defaultWeapon.classList.remove(defaultWeapon.classList[1]);
    defaultWeapon.classList.add(`${e.target.value}-wp`);
});

const buildNameCharLimit = 24;
const buildName = document.querySelector('#build-name');
buildName.addEventListener('keypress', (e) => {
    // disable input on reaching char limit and enter key
    if (buildName.innerText.length >= buildNameCharLimit || e.keyCode === 13) {
        e.preventDefault();
        return false;
    }
});
buildName.addEventListener('keyup', (e) => {
    // since enter key was already disabled, detecting an enter key
    // from a keyup event would likely mean the input is coming from an IME
    // this forces to cut the input when reaching the char limit
    // since the length isn't updated when using an IME (keypress handler won't work)
    if (e.keyCode === 13 && buildName.innerText.length >= buildNameCharLimit) {
        buildName.innerText = buildName.innerHTML.substring(0, 24);
    }
});
buildName.addEventListener('focus', (e) => {
    // remove placeholder
    if (e.target.innerText === 'Build Name') {
        e.target.innerText = '';
    }
});
buildName.addEventListener('blur', (e) => {
    // insert placeholder when leaving empty text
    if (!e.target.innerText || e.target.innerText === '\n') {
        e.target.innerText = 'Build Name';
    }
    // other than the enter key that enters the input from an IME,
    // the user can also unfocus the editable, this captures it
    if (buildName.innerText.length >= buildNameCharLimit) {
        buildName.innerText = buildName.innerHTML.substring(0, 24);
    }
});

// gear selection
let clickedSlot;
// weapon selection
const weaponsContainerChildren = Array.from(document.querySelector('#weapons-container').children);
const weaponsMenu = document.querySelector('#weapons-choices');
const weaponsImages = document.querySelectorAll('#weapons-container .img');
const weaponSlots = document.querySelectorAll('#weapons-container .slot');
weaponSlots.forEach((weaponSlot) => {
    weaponSlot.addEventListener('click', () => {
        clickedSlot = weaponsContainerChildren.indexOf(weaponSlot);
        weaponsMenu.classList.remove('hidden');
    });
});

const unavailableWeapons = new Set();
let weaponsToBeUnhidden;
function updateUnavailableWeapons(weapClassName, deleteEntry) {
    for (const key in collabForumlas) {
        // basic weapons
        if (basicWeapons.includes(weapClassName) && collabForumlas[key].includes(weapClassName)) {
            unavailableWeapons.add(key);
            if (deleteEntry) weaponsToBeUnhidden.add(key);
        }
        // collabs
        else if (collabWeapons.includes(weapClassName) && key === weapClassName) {
            [...collabForumlas[key]].forEach((weap) => {
                unavailableWeapons.add(weap);
                if (deleteEntry) weaponsToBeUnhidden.add(weap);
            });
            // ban collabs relating to basic weapons used for the initial collab
            collabForumlas[key].forEach(formula => updateUnavailableWeapons(formula, deleteEntry));
        }
    }
}

let collabLimit = 4
function unhideWeapons(targetClass) {
    weaponsToBeUnhidden.add(targetClass);
    weaponsToBeUnhidden.forEach((weaponClass) => {
        // continue banning collabs when >x collabs are equipped (depending on no. of active slots)
        if (equippedWeapons.filter(weap => collabWeapons.includes(weap)).length > collabLimit - 1 &&
            collabWeapons.includes(weaponClass)) {
            remainingCollabs.push(weaponClass);
        } else if (weaponsClassNames.indexOf(weaponClass) !== -1) {
            weapons[weaponsClassNames.indexOf(weaponClass)].classList.remove('hidden');
        }
        unavailableWeapons.delete(weaponClass);
    });
    // update equipped weapons
    equippedWeapons.splice(equippedWeapons.indexOf(targetClass), 1);
}

function checkCollabDisplay() {
    if (equippedWeapons.filter(weap => collabWeapons.includes(weap)).length === collabLimit - 1) {
        remainingCollabs.forEach((collab) => {
            weapons[weaponsClassNames.indexOf(collab)].classList.remove('hidden');
        });
    }
}

const weaponsAddSymbols = document.querySelectorAll('#weapons-container .add.material-symbols-outlined');
const weapons = document.querySelectorAll('#weapons-choices .weapon');
const equippedWeapons = [];
let remainingCollabs = [], oldClassName;
weapons.forEach((weapon) => {
    weapon.addEventListener('click', (e) => {
        weaponsAddSymbols[clickedSlot - 1].textContent = ''; // remove add symbol
        const classes = weaponsImages[clickedSlot].classList;
        const imgTarget = e.target.children.length > 0 ? e.target.children[0] : e.target;
        const weapClassName = imgTarget.classList[1];

        if (classes.length === 2) classes.remove(classes[1]);
        classes.add(weapClassName);
        weaponsMenu.classList.add('hidden');

        // unhide replaced gear
        if (weaponsClassNames.indexOf(oldClassName) !== -1 && oldClassName !== undefined) {
            weaponsToBeUnhidden = new Set();
            updateUnavailableWeapons(oldClassName, true);
            unhideWeapons(oldClassName);
            checkCollabDisplay();
        }
        // hide related gear in choices
        equippedWeapons.push(weapClassName); // update selected gears
        updateUnavailableWeapons(weapClassName, false);
        unavailableWeapons.add(weapClassName); // add selected gear
        unavailableWeapons.forEach((unavailableWeapon) => {
            if (weaponsClassNames.indexOf(unavailableWeapon) !== -1) {
                weapons[weaponsClassNames.indexOf(unavailableWeapon)].classList.add('hidden');
            }
        });
        // hide all remaining collabs on 4 weapons equipped
        if (equippedWeapons.filter(weap => collabWeapons.includes(weap)).length === collabLimit) {
            remainingCollabs = [];
            for (const key in collabForumlas) {
                if (!unavailableWeapons.has(key)) {
                    remainingCollabs.push(key);
                }
            }
            remainingCollabs.forEach((collab) => {
                weapons[weaponsClassNames.indexOf(collab)].classList.add('hidden');
            });
        }
    });
});
// item selection
const itemsContainerChildren = Array.from(document.querySelector('#items-container').children);
const itemsMenu = document.querySelector('#items-choices');
const itemsImages = document.querySelectorAll('#items-container .img');
const itemSlots = document.querySelectorAll('#items-container .slot');
itemSlots.forEach((itemSlot) => {
    itemSlot.addEventListener('click', () => {
        clickedSlot = itemsContainerChildren.indexOf(itemSlot);
        itemsMenu.classList.remove('hidden');
    });
});

const updateItemChoices = (targetClass) => items[itemsClassNames.indexOf(targetClass)].classList.remove('hidden');

const itemsAddSymbols = document.querySelectorAll('#items-container .add.material-symbols-outlined');
const items = document.querySelectorAll('#items-choices .item');
items.forEach((item) => {
    item.addEventListener('click', (e) => {
        itemsAddSymbols[clickedSlot].textContent = ''; // remove add symbol
        const classes = itemsImages[clickedSlot].classList;
        const imgTarget = e.target.children.length > 0 ? e.target.children[0] : e.target;
        const imgClassName = imgTarget.classList[1];

        if (classes.length === 2) classes.remove(classes[1]);
        classes.add(imgClassName);
        itemsMenu.classList.add('hidden');
        
        // unhide replaced gear
        if (itemsClassNames.indexOf(oldClassName) !== -1 && oldClassName !== undefined) {
            updateItemChoices(oldClassName);
        }
        // hide selected gear in choices
        items[itemsClassNames.indexOf(imgClassName)].classList.add('hidden');
    });
});
// stamps selection
const stampsContainerChildren = Array.from(document.querySelector('#stamps-container').children);
const stampsMenu = document.querySelector('#stamps-choices');
const stampsImages = document.querySelectorAll('#stamps-container .img');
const stampSlots = document.querySelectorAll('#stamps-container .slot');
stampSlots.forEach((stampSlot) => {
    stampSlot.addEventListener('click', () => {
        clickedSlot = stampsContainerChildren.indexOf(stampSlot);
        stampsMenu.classList.remove('hidden');
    });
});

const updateStampChoices = (targetClass) => stamps[stampsClassNames.indexOf(targetClass)].classList.remove('hidden');

const stampsAddSymbols = document.querySelectorAll('#stamps-container .add.material-symbols-outlined');
const stamps = document.querySelectorAll('#stamps-choices .stamp');
stamps.forEach((stamp) => {
    stamp.addEventListener('click', (e) => {
        stampsAddSymbols[clickedSlot].textContent = ''; // remove add symbol
        const classes = stampsImages[clickedSlot].classList;
        const stampTarget = e.target.children.length > 0 ? e.target.children[0] : e.target;
        const stampClassName = stampTarget.classList[1];

        if (classes.length === 2) classes.remove(classes[1]);
        classes.add(stampClassName);
        stampsMenu.classList.add('hidden');
        
        // unhide replaced gear
        if (stampsClassNames.indexOf(oldClassName) !== -1 && oldClassName !== undefined) {
            updateStampChoices(oldClassName);
        }
        // hide selected gear in choices
        stamps[stampsClassNames.indexOf(stampClassName)].classList.add('hidden');
    });
});

// remove gear
const removeButtons = document.querySelectorAll('.remove');
removeButtons.forEach((removeButton) => {
    removeButton.addEventListener('click', (e) => {
        const imageClasses = removeButton.parentNode.children[0].classList;
        const targetClass = imageClasses[1];
        imageClasses.remove(targetClass);
        // unhide choices elements
        if (itemsClassNames.indexOf(targetClass) !== -1) {
            updateItemChoices(targetClass);
        }
        if (stampsClassNames.indexOf(targetClass) !== -1) {
            updateStampChoices(targetClass);
        }
        if (weaponsClassNames.indexOf(targetClass) !== -1) {
            weaponsToBeUnhidden = new Set();
            updateUnavailableWeapons(targetClass, true);
            unhideWeapons(targetClass);
        }
        // enable collab options when a collab is removed from 4 collabs
        if (e.target.parentNode.classList.contains('weapon')) {
            checkCollabDisplay();
        }
        // bring back add symbol
        removeButton.parentNode.children[0].children[0].textContent = 'add';
        // stop event trigger on parent
        e.stopPropagation();
    });
});

// choices menu
const choicesBg = document.querySelector('#choices-bg');
choicesBg.addEventListener('click', () => {
    choicesBg.classList.add('hidden');
    weaponsMenu.classList.add('hidden');
    itemsMenu.classList.add('hidden');
    stampsMenu.classList.add('hidden');
    statsMenu.classList.add('hidden');
});
const choicesContainer = document.querySelector('#choices-container');
choicesContainer.addEventListener('click', e => e.stopPropagation());

const choices = document.querySelectorAll('.choice');
choices.forEach((choice) => {
    choice.addEventListener('click', () => {
        choicesBg.classList.add('hidden');
    });
});

// show/hide remove button
const slots = document.querySelectorAll('.slot');
slots.forEach((slot) => {
    slot.addEventListener('mouseover', () => {
        // only show remove button on equipped slot
        if (slot.children[0].classList.length !== 1) {
            slot.children[1].classList.remove('hidden');
        }
    });
    slot.addEventListener('mouseout', () => {
        slot.children[1].classList.add('hidden');
    });
    // show choices menu
    slot.addEventListener('click', (e) => {
        choicesBg.classList.remove('hidden');
        // store old class name in case of replacing existing gear
        let oldTarget;
        if (e.target.className.includes('slot')) {
            oldTarget = e.target.children[0];
        } else if (e.target.children.length > 0) {
            oldTarget = e.target.parentNode.children[0];
        } else {
            oldTarget = e.target.parentNode;
        }
        oldClassName = oldTarget.classList[1];
    });
});

// weapon slot display
const weaponSlotsInput = document.querySelector('#weapon-slots');
const weaponSlotsButtons = document.querySelectorAll('#weapon-slots button');
let oldWeaponSlotValue = 5;
weaponSlotsInput.addEventListener('keydown', e => e.preventDefault());
weaponSlotsButtons.forEach((weaponSlotsButton) => {
    weaponSlotsButton.addEventListener('click', function() {
        // hide slots based on value, decrease by 1 to include default weapon
        const slotAmount = this.parentNode.querySelector('input[type=number]').value - 1;
        if (oldWeaponSlotValue > slotAmount) {
            for (let i = 5 - 1; i >= slotAmount; i--) {
                weaponSlots[i].style.display = 'none';
            }
        } else {
            for (let i = 0; i < slotAmount; i++) {
                weaponSlots[i].style.display = '';
            }
        }
        oldWeaponSlotValue = slotAmount;
        // remove placed weapons
        for (let i = 0; i < 5; i++) removeButtons[i].click();
        // change collab limit
        if (slotAmount > 1) {
            collabLimit = slotAmount - 1;
        } else {
            collabLimit = 0;
            // hide all collabs on 1 weapon slot available (excluding default weapon)
            collabWeapons.forEach(collabWeapon => weapons[weaponsClassNames.indexOf(collabWeapon)].classList.add('hidden'));
        }
        if (oldWeaponSlotValue == 2) {
            // show collabs on 2 weapon slots available (excluding default weapon)
            collabWeapons.forEach(collabWeapon => weapons[weaponsClassNames.indexOf(collabWeapon)].classList.remove('hidden'));
        }
    });
});

// stat priority
const addStatPriority = document.querySelector('#add-stat-prio');
const statsMenu = document.querySelector('#stats-choices');
addStatPriority.addEventListener('click', () => {
    choicesBg.classList.remove('hidden');
    statsMenu.classList.remove('hidden');
});
const statChoicesStat = document.querySelectorAll('#stats-choices .stat');
let statPriorityList = [];
let order = 1;
statChoicesStat.forEach((stat) => {
    stat.addEventListener('click', () => {
        // unordered stat, assign order
        if (!stat.querySelector('.order').textContent) {
            stat.querySelector('.order').textContent = order;
            statPriorityList[order - 1] = stat.classList[1];
            order += 1;
        } else { // ordered stat unselected, remove order
            statPriorityList = [];
            const removedOrder = parseInt(stat.querySelector('.order').innerText);
            stat.querySelector('.order').textContent = null;
            order -= 1;
            // rearrange existing orders
            statChoicesStat.forEach((s) => {
                const currentOrder = parseInt(s.innerText);
                let subtract = 0;
                if (currentOrder > removedOrder) {
                    s.querySelector('.order').textContent = currentOrder - 1;
                    subtract = 1;
                }
                statPriorityList[currentOrder - subtract - 1] = s.classList[1];
            });
        }
    });
});
const statPriority = document.querySelector('#stat-priority');
const confirmOrder = document.querySelector('#confirm-order');
confirmOrder.addEventListener('click', () => {
    choicesBg.classList.add('hidden');
    statsMenu.classList.add('hidden');
    statPriority.classList.remove('hidden');
    statChoicesStat.forEach((stat) => stat.querySelector('.order').textContent = null); // remove order display
    statPriority.innerHTML = statPriorityList.map(cssClass => `<span class="stat ${cssClass}"></span>`).join(' > ');
    // reinitialize order no. and prio list
    order = 1
    statPriorityList = [];
});
const hideStatPriority = document.querySelector('#hide-stat-priority');
hideStatPriority.addEventListener('click', () => statPriority.classList.add('hidden'));

// show build name
const showBuildName = document.querySelector('#show-build-name');
showBuildName.addEventListener('change', (e) => {
    if (e.target.checked) {
        buildName.classList.remove('hidden');
    } else {
        buildName.classList.add('hidden');
    }
});
// show stamps
const stampsContainer = document.querySelector('#stamps-container');
const showStamps = document.querySelector('#show-stamps');
showStamps.addEventListener('change', (e) => {
    if (e.target.checked) {
        stampsContainer.classList.remove('hidden');
    } else {
        stampsContainer.classList.add('hidden');
    }
});

// clear buttons
const clearWeapons = document.querySelector('#clear-weapons');
clearWeapons.addEventListener('click', () => {
    for (let i = 0; i < 5; i++) removeButtons[i].click();
});
const clearItems = document.querySelector('#clear-items');
clearItems.addEventListener('click', () => {
    for (let i = 5; i < 11; i++) removeButtons[i].click();
});;
const clearStamps = document.querySelector('#clear-stamps');
clearStamps.addEventListener('click', () => {
    for (let i = 11; i < 14; i++) removeButtons[i].click();
});;

// save build as image
const capture = document.querySelector('#save-image');
capture.addEventListener('click', () => {
    html2canvas(document.querySelector('#build-container'), { backgroundColor: '#27272A' })
    .then((canvas) => {
        const fileName = document.querySelector('#build-name').textContent;
        canvas.toBlob(blob => FileSaver.saveAs(blob, `${fileName}.png`));
    });
});