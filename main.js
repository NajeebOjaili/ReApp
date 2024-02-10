const startRecordingBtn = document.getElementById('startRecording');
const stopRecordingBtn = document.getElementById('stopRecording');
const playRecordingBtn = document.getElementById('playRecording');
const audioPlayer = document.getElementById('audioPlayer');

let mediaRecorder;
let chunks = [];

startRecordingBtn.addEventListener('click', startRecording);
stopRecordingBtn.addEventListener('click', stopRecording);
playRecordingBtn.addEventListener('click', playRecording);

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(function(stream) {
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = function(e) {
                chunks.push(e.data);
            };
            mediaRecorder.onstop = function(e) {
                const blob = new Blob(chunks, { 'type' : 'audio/ogg; codecs=opus' });
                chunks = [];
                const audioURL = URL.createObjectURL(blob);
                audioPlayer.src = audioURL;
                playRecordingBtn.disabled = false;
            };
            mediaRecorder.start();
            startRecordingBtn.disabled = true;
            stopRecordingBtn.disabled = false;
        })
        .catch(function(err) {
            console.error('Error accessing microphone: ' + err);
        });
}

function stopRecording() {
    mediaRecorder.stop();
    startRecordingBtn.disabled = false;
    stopRecordingBtn.disabled = true;
}

function playRecording() {
    audioPlayer.play();
}
