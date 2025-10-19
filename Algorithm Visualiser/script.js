// Basic setup for array visualization
const visualizer = document.getElementById('visualizer');
let array = [];
let isSorting = false;
let speed = 300;

// Generate random array
function generateArray(size = 50) {
  array = [];
  visualizer.innerHTML = '';
  for (let i = 0; i < size; i++) {
    const value = Math.floor(Math.random() * 300) + 10;
    array.push(value);
    const bar = document.createElement('div');
    bar.classList.add('bar');
    bar.style.height = value + 'px';
    visualizer.appendChild(bar);
  }
}

// Delay utility for animation
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Bubble Sort Animation
async function bubbleSort() {
  isSorting = true;
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      bars[j].classList.add('active');
      bars[j + 1].classList.add('active');
      if (array[j] > array[j + 1]) {
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        bars[j].style.height = array[j] + 'px';
        bars[j + 1].style.height = array[j + 1] + 'px';
      }
      await sleep(speed);
      bars[j].classList.remove('active');
      bars[j + 1].classList.remove('active');
    }
    bars[array.length - i - 1].classList.add('sorted');
  }
  isSorting = false;
}

// Pause and Reset functionality variables
let isPaused = false;
let stopRequested = false;

async function bubbleSort() {
  isSorting = true;
  stopRequested = false;
  const bars = document.getElementsByClassName('bar');
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      // Pause check
      while (isPaused) {
        await sleep(100);
      }
      if (stopRequested) {
        isSorting = false;
        return;
      }
      bars[j].classList.add('active');
      bars[j + 1].classList.add('active');
      if (array[j] > array[j + 1]) {
        let temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        bars[j].style.height = array[j] + 'px';
        bars[j + 1].style.height = array[j + 1] + 'px';
      }
      await sleep(speed);
      bars[j].classList.remove('active');
      bars[j + 1].classList.remove('active');
    }
    bars[array.length - i - 1].classList.add('sorted');
  }
  isSorting = false;
}

// Event listeners
const randomizeBtn = document.getElementById('randomize');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const sizeSlider = document.getElementById('array-size');
const speedSlider = document.getElementById('speed');
const algorithmSelect = document.getElementById('algorithm-select');

randomizeBtn.addEventListener('click', () => {
  generateArray(sizeSlider.value);
});

startBtn.addEventListener('click', () => {
  if (isSorting) return;
  const algorithm = algorithmSelect.value;
  if (algorithm === 'bubble') bubbleSort();
});

pauseBtn.addEventListener('click', () => {
  if (!isSorting) return;
  isPaused = !isPaused;
  pauseBtn.textContent = isPaused ? 'Resume' : 'Pause';
});

resetBtn.addEventListener('click', () => {
  stopRequested = true;
  isPaused = false;
  pauseBtn.textContent = 'Pause';
  generateArray(sizeSlider.value);
});

sizeSlider.addEventListener('input', () => {
  generateArray(sizeSlider.value);
});

speedSlider.addEventListener('input', () => {
  speed = speedSlider.value;
});

// Initial call to populate array on load
generateArray(50);

// Insertion Sort Animation
async function insertionSort() {
  isSorting = true;
  stopRequested = false;
  const bars = document.getElementsByClassName('bar');
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (isPaused) await sleep(100);
    if (stopRequested) { isSorting = false; return; }
    bars[i].classList.add('active');
    await sleep(speed);
    while (j >= 0 && array[j] > key) {
      while (isPaused) await sleep(100);
      if (stopRequested) { isSorting = false; return; }
      array[j + 1] = array[j];
      bars[j + 1].style.height = array[j + 1] + 'px';
      bars[j].classList.add('active');
      await sleep(speed);
      bars[j].classList.remove('active');
      j--;
    }
    array[j + 1] = key;
    bars[j + 1].style.height = key + 'px';
    bars[i].classList.remove('active');
  }
  isSorting = false;
}

// Merge Sort Animation
async function mergeSort(arr, left, right) {
  if (left >= right || !isSorting) return;
  const mid = Math.floor((left + right) / 2);
  await mergeSort(arr, left, mid);
  await mergeSort(arr, mid + 1, right);
  await merge(arr, left, mid, right);
}

async function merge(arr, left, mid, right) {
  const bars = document.getElementsByClassName('bar');
  let leftArr = arr.slice(left, mid + 1);
  let rightArr = arr.slice(mid + 1, right + 1);
  let i = 0, j = 0, k = left;

  while (i < leftArr.length && j < rightArr.length) {
    while (isPaused) await sleep(100);
    if (stopRequested) { isSorting = false; return; }
    bars[k].classList.add('active');
    await sleep(speed);
    if (leftArr[i] <= rightArr[j]) {
      arr[k] = leftArr[i];
      bars[k].style.height = leftArr[i] + 'px';
      i++;
    } else {
      arr[k] = rightArr[j];
      bars[k].style.height = rightArr[j] + 'px';
      j++;
    }
    bars[k].classList.remove('active');
    k++;
  }

  while (i < leftArr.length) {
    while (isPaused) await sleep(100);
    if (stopRequested) { isSorting = false; return; }
    bars[k].classList.add('active');
    await sleep(speed);
    arr[k] = leftArr[i];
    bars[k].style.height = leftArr[i] + 'px';
    bars[k].classList.remove('active');
    i++;
    k++;
  }

  while (j < rightArr.length) {
    while (isPaused) await sleep(100);
    if (stopRequested) { isSorting = false; return; }
    bars[k].classList.add('active');
    await sleep(speed);
    arr[k] = rightArr[j];
    bars[k].style.height = rightArr[j] + 'px';
    bars[k].classList.remove('active');
    j++;
    k++;
  }
}

startBtn.addEventListener('click', () => {
  if (isSorting) return;
  const algorithm = algorithmSelect.value;
  if (algorithm === 'bubble') bubbleSort();
  if (algorithm === 'insertion') insertionSort();
  if (algorithm === 'merge') {
    isSorting = true;
    stopRequested = false;
    mergeSort(array, 0, array.length - 1).then(() => { isSorting = false; });
  }
});
