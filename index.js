const fs = require('fs');

// set samplerate
const SAMPLERATE = 48000;

// generate random notes
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// set the frequency
function frequencySetter(freq) {
    return freq / (SAMPLERATE / (2 * Math.PI));
}

// renders frequency, gain, duration to a list of samples
function renderSound(freq, gain, duration) {
    // 
    let samples = []
    // push sine values to the array
    for (let x = 0; x < SAMPLERATE * duration; x++) {
        samples.push(Math.sin(x * frequencySetter(freq) * gain));
    }
    return samples;
}

// list of frequency values
let notefrequencies = [randomNumber(200, 900), randomNumber(200, 900), randomNumber(200, 900), randomNumber(200, 900)];

// open a file
let fd = fs.openSync('./audio.raw', 'w');


// write notes to the file
for (const freq of notefrequencies) {
    let gain = 0.5
    let duration = randomNumber(0.1, 1)
    const samples = renderSound(freq, gain, duration);
    // ceremony 
    let arr = new Float32Array(samples);
    let dataview = new DataView(arr.buffer)
    dataview.setFloat32(0, arr[0], true);
    let buf = new Uint8Array(arr.buffer);
    // write the buffer to the file
    fs.writeSync(fd, buf);
}


// close the file
fs.closeSync(fd);

// run ffplay -f f32le -ar 48000 audio.raw in your terninal and it should play an audio file!
