const fs = require('fs');

// create an array
let samples = [];

// create a scale multiplier (this sets the frequency)
let scale = 0.05 // (48000 / 2pi) * scale = frequency. ~764hz in this case

// set the frequency
function frequencySetter(freq) {
    return freq / (samplerate / (2 * Math.PI));
}

// create gain 
let gain = 0.5

// set duration
let duration = 1;

// set samplerate
let samplerate = 48000;

// push sine values to the array
for (let x = 0; x < samplerate * duration; x++) {
    samples.push(Math.sin(x * frequencySetter(440)) * gain);
}

// ceremony 
let arr = new Float32Array(samples);
let dataview = new DataView(arr.buffer)
dataview.setFloat32(0, arr[0], true);
let buf = new Uint8Array(arr.buffer);

// open a file
let fd = fs.openSync('./audio.raw', 'w');
// write the buffer to the file
fs.writeSync(fd, buf);
// close the file
fs.closeSync(fd);

// run ffplay -f f32le -ar 48000 audio.raw in your terninal and it should play an audio file!
