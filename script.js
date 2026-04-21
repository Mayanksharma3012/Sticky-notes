// DOM variable
const Create_Btn = document.querySelector('.Create-btn button');
const After_Create_btn = document.querySelector('.After-Create-btn');
const wall = document.querySelector('.wall');
const header = document.querySelector('header');
const New_Class = document.querySelector('.New-class');
const Color_picker = document.querySelectorAll('.color-dot');
const Style_picker = document.querySelectorAll('.style');
const Cancel_btn = document.querySelector('.cancel');
const Post_btn = document.querySelector('.post');
const input = document.querySelector('.inp')
const empty_inp = document.querySelector('.empty')
const input_length = document.querySelector('.len-inp')
const cards = document.querySelectorAll('.card')
const notes_count = document.querySelector('.notes-count')
const random = document.querySelector('.random')
const newest = document.querySelector('.Newest')
const oldest = document.querySelector('.oldest')



// Known color and style names used on cards
const COLOR_NAMES = ['Cream','Blush','Mist','Sage','Lilac','Wheat'];
const STYLE_NAMES = ['lined','plain','graph','dotted','dark','square'];



// ===== LOCAL STORAGE =====

// Save all cards to localStorage
function saveToLocalStorage() {
  const allCards = document.querySelectorAll('.card');

  const notes = Array.from(allCards).map(card => {
    // prefer explicit dataset values, fallback to class matching
    const text = card.querySelector('p') ? card.querySelector('p').innerText : card.innerText;
    const color = card.dataset.color || Array.from(card.classList).find(c => COLOR_NAMES.includes(c));
    const style = card.dataset.style || Array.from(card.classList).find(s => STYLE_NAMES.includes(s));
    const timestamp = card.dataset.timestamp || Date.now().toString();
    return {
      text: text,
      color: color || null,
      style: style || null,
      timestamp: timestamp
    };
  });

  // filter out any empty notes before saving
  const filtered = notes.filter(n => n.text && n.text.toString().trim().length > 0);
  localStorage.setItem('notes', JSON.stringify(filtered));
}

// Load cards from localStorage
function loadFromLocalStorage() {
  const data = localStorage.getItem('notes');
  if (!data) return;

  const notes = JSON.parse(data);

  // filter and clean stored notes (remove empties)
  const filtered = Array.isArray(notes) ? notes.filter(n => n && n.text && n.text.toString().trim().length > 0) : [];
  // if storage had empties, overwrite with cleaned array
  if (JSON.stringify(filtered) !== JSON.stringify(notes)) {
    localStorage.setItem('notes', JSON.stringify(filtered));
  }

  // remove any existing cards (prevent duplicates from hardcoded examples)
  document.querySelectorAll('.card').forEach(c => c.remove());

  // sort by timestamp desc so newest appear first
  filtered.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

  filtered.forEach(note => {
    const card = document.createElement('div');
    card.classList.add('card');

    const p = document.createElement('p');
    p.textContent = note.text;
    card.appendChild(p);

    if (note.color) {
      card.classList.add(note.color);
      card.dataset.color = note.color;
    }
    if (note.style) {
      card.classList.add(note.style);
      card.dataset.style = note.style;
    }

    if (note.timestamp) card.dataset.timestamp = note.timestamp;

    applyRandomTilt(card);
    wall.appendChild(card);
  });

  count_cards();
}








// count all notes
function count_cards(){
  // count only cards that have non-empty text
  const allCards = Array.from(document.querySelectorAll('.card'))
    .filter(c => {
      const p = c.querySelector('p');
      return p && p.textContent && p.textContent.trim().length > 0;
    });
  notes_count.innerHTML = `${allCards.length} Notes`;
}


// Apply a random tilt class to a card element
function applyRandomTilt(card){
  if(!card) return;
  // remove any existing tilt classes
  card.classList.remove('tilt-left','tilt-right','tilt-normal');
  const tilts = ['tilt-left','tilt-right','tilt-normal'];
  const choice = tilts[Math.floor(Math.random() * tilts.length)];
  card.classList.add(choice);
}

// Apply tilt to any existing cards on load
document.querySelectorAll('.card').forEach(c => applyRandomTilt(c));



function AfterCreateOpen(e){
  e.stopPropagation();
  // ensure any previous falling class is removed then open
  After_Create_btn.classList.remove('falling');
  After_Create_btn.classList.add('open');
}

// help us select color
Color_picker.forEach(color => {
  color.addEventListener('click', () => {
    Color_picker.forEach(c => {
      if(c.classList.contains('selected')) c.classList.remove('selected');
    });
    color.classList.add('selected');
  }
);
});

// help us select style
Style_picker.forEach(style => {
  style.addEventListener('click', () => {
    Style_picker.forEach(s => {
      if(s.classList.contains('selected')) s.classList.remove('selected');
    });
    style.classList.add('selected');
  });
});

// Close the create panel with a falling animation
function closeWithFall(){
  if(!After_Create_btn.classList.contains('open')) return;
  // remove 'open' (so styles don't conflict) and add falling state which will animate via CSS
  After_Create_btn.classList.remove('open');
  After_Create_btn.classList.add('falling');
  // wait for transition to finish then clean up classes
  const onEnd = (ev) => {
    if (ev.target !== After_Create_btn) return;
    // only react to transform or opacity end
    if (ev.propertyName === 'transform' || ev.propertyName === 'opacity'){
      After_Create_btn.classList.remove('falling','open');
      After_Create_btn.removeEventListener('transitionend', onEnd);
    }
  };
  After_Create_btn.addEventListener('transitionend', onEnd);
}

Cancel_btn.addEventListener('click', () => closeWithFall());

// if user click post button
function Post_it(){
  // Clear existing error message first
  const existingError = empty_inp.querySelector('span');
  if(existingError) existingError.remove();
  
  if(!input.value || input.value.trim().length === 0){
    const empty_text = document.createElement('span')
    empty_inp.appendChild(empty_text);
    empty_text.innerHTML = 'Please enter some text before Posting'
  }
  else{
    let selected_color = document.querySelector('.color-dot.selected');
    let selected_style = document.querySelector('.style.selected');

    const card = document.createElement('div');
    card.classList.add('card')

    // add chosen color/style as classes and dataset so they persist
    if (selected_color) {
      card.classList.add(selected_color.dataset.color);
      card.dataset.color = selected_color.dataset.color;
    }
    if (selected_style) {
      card.classList.add(selected_style.dataset.style);
      card.dataset.style = selected_style.dataset.style;
    }

    const p = document.createElement('p');
    p.textContent = input.value;
    card.appendChild(p);

    // Add timestamp to new card
    card.dataset.timestamp = Date.now();

    // give the new card a random tilt before appending
    applyRandomTilt(card);
    // put new notes at the start so they're immediately visible
    wall.prepend(card);
    count_cards();
    saveToLocalStorage();
    input.value = "";
    // close with falling animation
    closeWithFall();




    

    
  }
}

// Remove error message when user types
input.addEventListener('input', () => {
  const existingError = empty_inp.querySelector('span');
  if(existingError) existingError.remove();
  input_length.innerHTML = `${input.value.length} / 120`
})





function shuffleDOMCards() {
  const allCards = Array.from(document.querySelectorAll('.card'));
  
  // Reset any existing order styles first
  allCards.forEach(card => card.style.order = '');
  
  // Fisher-Yates shuffle
  for (let i = allCards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    wall.insertBefore(allCards[j], allCards[i]);
    // swap in array too
    [allCards[i], allCards[j]] = [allCards[j], allCards[i]];
  }
}

// random.addEventListener('click', shuffleDOMCards);





// Sort cards by newest first (highest timestamp first)
function sortNewestToOldest() {
  const allCards = Array.from(document.querySelectorAll('.card'));
  allCards.forEach(card => card.style.order = '');
  allCards
    .sort((a, b) => (b.dataset.timestamp || 0) - (a.dataset.timestamp || 0))
    .forEach(card => wall.appendChild(card));
}

function sortOldestToNewest() {
  const allCards = Array.from(document.querySelectorAll('.card'));
  allCards.forEach(card => card.style.order = '');
  allCards
    .sort((a, b) => (a.dataset.timestamp || 0) - (b.dataset.timestamp || 0))
    .forEach(card => wall.appendChild(card));
}


random.addEventListener('click', () => {
  shuffleDOMCards();
  saveToLocalStorage();
});

newest.addEventListener('click', () => {
  sortNewestToOldest();
  saveToLocalStorage();
});

oldest.addEventListener('click', () => {
  sortOldestToNewest();
  saveToLocalStorage();
});








loadFromLocalStorage();
count_cards()

Create_Btn.addEventListener('click', AfterCreateOpen); 

Post_btn.addEventListener('click', Post_it)

document.addEventListener('click', (e) => {
  if (After_Create_btn.classList.contains('open')){
    if (!After_Create_btn.contains(e.target)) closeWithFall();
  }
})

