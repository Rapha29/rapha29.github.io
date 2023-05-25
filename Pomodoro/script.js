const studyTime = 1 * 60;
const breakTime = 1 * 60;
let currentTimer = studyTime;
let isPaused = true;
let timerInterval;

const timerLabel = document.getElementById('timer-label');
const timeLeft = document.getElementById('time-left');
const startStopBtn = document.getElementById('start_stop');

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function toggleTimer() {
  if (isPaused) {
    startTimer();
  } else {
    pauseTimer();
  }
}

function startTimer() {
  isPaused = false;
  startStopBtn.textContent = 'Pause';
  timerInterval = setInterval(() => {
    currentTimer--;
    timeLeft.textContent = formatTime(currentTimer);
    if (currentTimer === 0) {
      clearInterval(timerInterval);
      if (timerLabel.textContent === 'Study') {
        alert('Time for a break!');
        timerLabel.textContent = 'Break';
        currentTimer = breakTime;
      } else {
        alert('Time to get back to work!');
        timerLabel.textContent = 'Study';
        currentTimer = studyTime;
      }
      startTimer();
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = true;
  startStopBtn.textContent = 'Start';
  clearInterval(timerInterval);
}

startStopBtn.addEventListener('click', toggleTimer);

timerLabel.textContent = 'Study';
timeLeft.textContent = formatTime(studyTime);