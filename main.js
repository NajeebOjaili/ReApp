const startBtn = document.getElementById("start-btn");
const stopBtn = document.getElementById("stop-btn");
const saveBtn = document.getElementById("save-btn");
const recordedAudio = document.getElementById("recorded-audio");

let mediaRecorder;
let recordedBlobs;

startBtn.addEventListener("click", () => {
  navigator.mediaDevices
    .getUserMedia({ audio: true })
    .then((stream) => {
      recordedBlobs = [];
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.addEventListener("dataavailable", (event) => {
        if (event.data.size > 0) {
          recordedBlobs.push(event.data);
        }
      });
      mediaRecorder.start();
      startBtn.disabled = true;
      stopBtn.disabled = false;
    })
    .catch((error) => {
      console.error("Error accessing microphone", error);
    });
});

stopBtn.addEventListener("click", () => {
  mediaRecorder.stop();
  startBtn.disabled = false;
  stopBtn.disabled = true;
  saveBtn.disabled = false;
});

mediaRecorder.addEventListener("stop", () => {
  const recordedBlob = new Blob(recordedBlobs, { type: "audio/mp3" });
  recordedAudio.src = URL.createObjectURL(recordedBlob);
  recordedAudio.play();
});

saveBtn.addEventListener("click", () => {
  const blob = new Blob(recordedBlobs, { type: "audio/mp3" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = "recording.mp3";
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 100);
});

const videoPreview = document.getElementById("videoPreview");
const startRecordingButton = document.getElementById("startRecording");
const stopRecordingButton = document.getElementById("stopRecording");
const downloadLink = document.getElementById("downloadLink");

let mediaRecorder;
let recordedChunks = [];

startRecordingButton.addEventListener("click", startRecording);
stopRecordingButton.addEventListener("click", stopRecording);

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });

        videoPreview.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const videoBlob = new Blob(recordedChunks, { type: "video/webm" });
            recordedChunks = [];

            const videoURL = URL.createObjectURL(videoBlob);
            downloadLink.href = videoURL;
            downloadLink.style.display = "block";
            downloadLink.download = "recorded-video.webm";
        };

        mediaRecorder.start();
        startRecordingButton.disabled = true;
        stopRecordingButton.disabled = false;
    } catch (error) {
        console.error("Error starting recording:", error);
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state === "recording") {
        mediaRecorder.stop();
        startRecordingButton.disabled = false;
        stopRecordingButton.disabled = true;
    }
}