// ===== Algorithm Visualiser - Full Version =====

const visualizer = document.getElementById('visualizer');
const randomizeBtn = document.getElementById('randomize');
const startBtn = document.getElementById('start');
const pauseBtn = document.getElementById('pause');
const resetBtn = document.getElementById('reset');
const sizeSlider = document.getElementById('array-size');
const speedSlider = document.getElementById('speed');
const algorithmSelect = document.getElementById('algorithm-select');


let array = [];
let isSorting = false;
let isPaused = false;
let stopRequested = false;
let speed = 300;

// ===== Utility Functions =====

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

//swap elements in array and update bars
function swap(bars, i, j) {
  let temp = array[i];
  array[i] = array[j];
  array[j] = temp;
  bars[i].style.height = array[i] + 'px';
  bars[j].style.height = array[j] + 'px';
}

// ===== Sorting Algorithms =====

// --- Bubble Sort ---
async function bubbleSort() {
  isSorting = true;
  stopRequested = false;
  const bars = document.getElementsByClassName('bar');

  
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      if (stopRequested) return (isSorting = false);
      while (isPaused) await sleep(100);

      bars[j].classList.add('active');
      bars[j + 1].classList.add('active');

      if (array[j] > array[j + 1]) swap(bars, j, j + 1);

      await sleep(speed);
      bars[j].classList.remove('active');
      bars[j + 1].classList.remove('active');
    }
    bars[array.length - i - 1].classList.add('sorted');
  }

  isSorting = false;
}

// --- Insertion Sort ---
async function insertionSort() {
  isSorting = true;
  stopRequested = false;
  const bars = document.getElementsByClassName('bar');

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (isPaused) await sleep(100);
    if (stopRequested) return (isSorting = false);

    bars[i].classList.add('active');
    await sleep(speed);

    while (j >= 0 && array[j] > key) {
      while (isPaused) await sleep(100);
      if (stopRequested) return (isSorting = false);

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

  const barsFinal = document.getElementsByClassName('bar');
  for (let k = 0; k < barsFinal.length; k++) {
    barsFinal[k].classList.add('sorted');
  }

  isSorting = false;
}

// --- Merge Sort ---
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
    if (stopRequested) return (isSorting = false);

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
    if (stopRequested) return (isSorting = false);

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
    if (stopRequested) return (isSorting = false);

    bars[k].classList.add('active');
    await sleep(speed);
    arr[k] = rightArr[j];
    bars[k].style.height = rightArr[j] + 'px';
    bars[k].classList.remove('active');
    j++;
    k++;
  }
}

// --- Selection Sort ---
async function selectionSort() {
  isSorting = true;
  stopRequested = false;
  const bars = document.getElementsByClassName('bar');
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    bars[minIdx].classList.add('active');
    for (let j = i + 1; j < n; j++) {
      while (isPaused) await sleep(100);
      if (stopRequested) return (isSorting = false);
      bars[j].classList.add('active');
      await sleep(speed);

      if (array[j] < array[minIdx]) {
        bars[minIdx].classList.remove('active');
        minIdx = j;
      }
      bars[j].classList.remove('active');
    }
    if (minIdx !== i) swap(bars, i, minIdx);
    bars[i].classList.remove('active');
    bars[i].classList.add('sorted');
  }

  bars[n - 1].classList.add('sorted');
  isSorting = false;
}

// --- Radix Sort (LSD) ---
async function radixSort() {
  isSorting = true;
  stopRequested = false;
  const bars = document.getElementsByClassName('bar');

  const getMax = (arr) => Math.max(...arr);
  const countingSort = async (exp) => {
    let output = new Array(array.length).fill(0);
    let count = new Array(10).fill(0);

    for (let i = 0; i < array.length; i++) {
      let index = Math.floor(array[i] / exp) % 10;
      count[index]++;
    }

    for (let i = 1; i < 10; i++) count[i] += count[i - 1];

    for (let i = array.length - 1; i >= 0; i--) {
      let index = Math.floor(array[i] / exp) % 10;
      output[count[index] - 1] = array[i];
      count[index]--;
    }

    for (let i = 0; i < array.length; i++) {
      while (isPaused) await sleep(100);
      if (stopRequested) return (isSorting = false);
      array[i] = output[i];
      bars[i].style.height = array[i] + 'px';
      bars[i].classList.add('active');
      await sleep(speed);
      bars[i].classList.remove('active');
    }
  };

  let m = getMax(array);
  for (let exp = 1; Math.floor(m / exp) > 0; exp *= 10) {
    await countingSort(exp);
  }

  const barsFinal = document.getElementsByClassName('bar');
  for (let i = 0; i < barsFinal.length; i++) {
    barsFinal[i].classList.add('sorted');
  }

  isSorting = false;
}

// Event Listeners 

randomizeBtn.addEventListener('click', () => {
  generateArray(sizeSlider.value);
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

startBtn.addEventListener('click', () => {
  if (isSorting) return;
  const algorithm = algorithmSelect.value;

  if (algorithm === 'bubble') bubbleSort();
  if (algorithm === 'insertion') insertionSort();
  if (algorithm === 'merge') {
    isSorting = true;
    stopRequested = false;
    mergeSort(array, 0, array.length - 1).then(() => (isSorting = false));
  }
  if (algorithm === 'selection') selectionSort();
  if (algorithm === 'radix') radixSort();
});

// Initialise
generateArray(50);

// Time Complexity Graph
function generateComplexityGraph() {
  const ctx = document.getElementById('complexityChart').getContext('2d');

  const nValues = [10, 50, 100, 250, 500, 1000];

  const bubble = nValues.map(n => n * n);          // O(n^2)
  const insertion = nValues.map(n => n * n);       // O(n^2)
  const selection = nValues.map(n => n * n);       // O(n^2)
  const merge = nValues.map(n => n * Math.log2(n)); // O(n log n)
  const radix = nValues.map(n => n * 10);          // O(n·k) ~ linear

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: nValues,
      datasets: [
        {
          label: 'Bubble Sort (O(n²))',
          data: bubble,
          borderColor: '#ff6384',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Insertion Sort (O(n²))',
          data: insertion,
          borderColor: '#ffcd56',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Selection Sort (O(n²))',
          data: selection,
          borderColor: '#4bc0c0',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Merge Sort (O(n log n))',
          data: merge,
          borderColor: '#36a2eb',
          fill: false,
          tension: 0.3,
        },
        {
          label: 'Radix Sort (O(n·k))',
          data: radix,
          borderColor: '#9966ff',
          fill: false,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      scales: {
        x: {
          title: {
            display: true,
            text: 'Input Size (n)',
            color: '#ffffff',
          },
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255,255,255,0.1)' },
        },
        y: {
          title: {
            display: true,
            text: 'Relative Operations',
            color: '#ffffff',
          },
          ticks: { color: '#ffffff' },
          grid: { color: 'rgba(255,255,255,0.1)' },
        },
      },
      plugins: {
        legend: {
          labels: { color: '#ffffff' },
        },
        title: {
          display: false,
        },
      },
    },
  });
}

generateComplexityGraph();

