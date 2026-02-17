const cows = [
  { id: 'AZE12342', name: 'Mila', phaseHint: 'Wczesna laktacja' },
  { id: 'AZE12343', name: 'Luna', phaseHint: 'Środkowa laktacja' },
  { id: 'AZE12346', name: 'Kaja', phaseHint: 'Późna laktacja' },
];

const milkRanges = {
  'Wczesna laktacja': { 5: [40, 45], 4: [35, 39], 3: [30, 35], 2: [25, 30], 1: [22, 24] },
  'Środkowa laktacja': { 5: [34, 38], 4: [30, 34], 3: [26, 32], 2: [22, 26], 1: [19, 21] },
  'Późna laktacja': { 5: [28, 30], 4: [24, 28], 3: [20, 24], 2: [16, 20], 1: [13, 15] },
};

const scoreLabel = {
  5: 'bardzo wysoka',
  4: 'wysoka',
  3: 'średnia',
  2: 'niska',
  1: 'poza normą',
};

const state = {
  screen: 'splash',
  selectedCow: null,
  selectedFile: null,
  previewUrl: '',
};

const screens = {
  splash: document.querySelector('#screen-splash'),
  menu: document.querySelector('#screen-menu'),
  herd: document.querySelector('#screen-herd'),
  upload: document.querySelector('#screen-upload'),
  preview: document.querySelector('#screen-preview'),
  result: document.querySelector('#screen-result'),
};

const backButton = document.querySelector('#backButton');
const menuHerdButton = document.querySelector('#menuHerdButton');
const cowList = document.querySelector('#cowList');
const usgInput = document.querySelector('#usgInput');
const analyzeButton = document.querySelector('#analyzeButton');
const finishButton = document.querySelector('#finishButton');
const selectedCowLabel = document.querySelector('#selectedCowLabel');
const previewCowLabel = document.querySelector('#previewCowLabel');
const resultCowLabel = document.querySelector('#resultCowLabel');
const previewImage = document.querySelector('#previewImage');
const resultCard = document.querySelector('#resultCard');

const screenParents = {
  splash: null,
  menu: null,
  herd: 'menu',
  upload: 'herd',
  preview: 'upload',
  result: 'herd',
};

const setScreen = (name) => {
  Object.entries(screens).forEach(([key, element]) => {
    element.classList.toggle('active', key === name);
  });
  state.screen = name;
  backButton.classList.toggle('hidden', !screenParents[name]);
};

const goToPreview = () => {
  if (!state.selectedFile || !state.selectedCow) return;
  if (state.previewUrl) URL.revokeObjectURL(state.previewUrl);

  state.previewUrl = URL.createObjectURL(state.selectedFile);
  previewCowLabel.textContent = `Podgląd dla: ${state.selectedCow.id}`;
  previewImage.src = state.previewUrl;
  setScreen('preview');
};

const renderCows = () => {
  cowList.innerHTML = '';
  for (const cow of cows) {
    const card = document.createElement('article');
    card.className = 'cow-card';
    card.innerHTML = `
      <h2>${cow.id} • ${cow.name}</h2>
      <div class="meta">Sugerowana faza: ${cow.phaseHint}</div>
      <button class="button" type="button">Nowe badanie</button>
    `;

    card.querySelector('button').addEventListener('click', () => {
      state.selectedCow = cow;
      selectedCowLabel.textContent = `Krowa: ${cow.id} (${cow.name})`;
      usgInput.value = '';
      state.selectedFile = null;
      setScreen('upload');
    });

    cowList.append(card);
  }
};

const deterministicInference = async (file, cow) => {
  const bytes = new Uint8Array(await file.arrayBuffer());
  let hash = 2166136261;

  for (const byte of bytes) {
    hash ^= byte;
    hash = Math.imul(hash, 16777619);
  }

  for (const char of cow.id) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  const phases = ['Wczesna laktacja', 'Środkowa laktacja', 'Późna laktacja'];
  const phase = phases[Math.abs(hash) % phases.length];
  const score = (Math.abs(hash >> 3) % 5) + 1;
  const [min, max] = milkRanges[phase][score];
  const expected = min + (Math.abs(hash >> 6) % (max - min + 1));

  return { phase, score, expected };
};

menuHerdButton.addEventListener('click', () => setScreen('herd'));

usgInput.addEventListener('change', () => {
  const [file] = usgInput.files;
  state.selectedFile = file ?? null;
  if (state.selectedFile) {
    goToPreview();
  }
});

analyzeButton.addEventListener('click', async () => {
  if (!state.selectedFile || !state.selectedCow) return;

  analyzeButton.disabled = true;
  analyzeButton.textContent = 'Analizuję obraz...';

  await new Promise((resolve) => setTimeout(resolve, 1100));
  const result = await deterministicInference(state.selectedFile, state.selectedCow);

  resultCowLabel.textContent = `Wynik badania: ${state.selectedCow.id}`;
  resultCard.innerHTML = `
    <p>Identyfikator: <strong>${state.selectedCow.id}</strong></p>
    <p>Faza laktacji: <strong>${result.phase}</strong></p>
    <p>Współczynnik mleczności:</p>
    <p class="score">${result.score}/5 • ${scoreLabel[result.score]}</p>
    <p>Prognoza: W ciągu następnych dni możesz się średnio spodziewać <strong>${result.expected} kg mleka dziennie</strong>.</p>
    <p class="meta">Predykcja liczona do końca bieżącego cyklu laktacji.</p>
  `;

  analyzeButton.disabled = false;
  analyzeButton.textContent = 'Analizuj';
  setScreen('result');
});

finishButton.addEventListener('click', () => setScreen('herd'));

backButton.addEventListener('click', () => {
  const parent = screenParents[state.screen];
  if (parent) setScreen(parent);
});

renderCows();
setScreen('splash');
setTimeout(() => setScreen('menu'), 1500);
