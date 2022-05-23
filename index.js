const { execSync } = require('child_process');
const fs = require('fs');
const { exec } = require('node:child_process')

// set samplerate
const SAMPLERATE = 48000;

// generate random notes
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}

// set the frequency based on our sample rate
function frequencySetter(freq) {
    return freq / (SAMPLERATE / (2 * Math.PI));
}

let notes = [
    {freq: 261.63, note: 'C4'}, 
    {freq: 293.66, note: 'D4'}, 
    {freq: 329.63, note: 'E4'}, 
    {freq: 349.23, note: 'F4'}, 
    {freq: 392.00, note: 'G4'}, 
    {freq: 440.00, note: 'A4'}, 
    {freq: 493.88, note: 'B4'}
];

// renders frequency, gain, duration to a list of samples
function renderSound(freq, gain, duration) {
    // 
    let samples = []
    // push sine values to the array
    for (let x = 0; x < SAMPLERATE * duration; x++) { // we multiply our sample rate by duration: 48000 snapshots of audio per second of audio
        samples.push(Math.sin(x * frequencySetter(freq) * gain)); 
    }
    return samples;
}

// step1: stop using noteFrequencies to get the notes, use notes instead for both the frequency and the duration
// and loop over it below

// starting frequency,
// return the 1, 3, 5, 8 arpeggio as frequency, push this to the notes array. duration can be the same for each.

// open a file
let fd = fs.openSync('./audio.raw', 'w');


// write notes to the file
for (const note of notes) {
    // hard code the gain here
    let gain = randomNumber(0.1, 0.8)
    // hard code the duration here
    let duration = randomNumber(0.1, 1)
    // here we run the renderSound function, passing in a note from our "notes" object on line 16, as well as our hardcoded gain and duration values. 
    // this creates 48000 * the duration number of samples into the samples array, which we then play.
    const samples = renderSound(note.freq, gain, duration);
    
    // ceremony 
    // create a Float32 array
    let arr = new Float32Array(samples);
    let dataview = new DataView(arr.buffer)
    // set the format for how to access the data
    dataview.setFloat32(0, arr[0], true); // specify little endian with 'true'
    let buf = new Uint8Array(arr.buffer);
    // write the buffer to the file
    fs.writeSync(fd, buf);
}
// close the file
fs.closeSync(fd);

// delete the old file if it exists
try {
    let deleteOld = fs.unlinkSync('file.wav');
} catch {
}
// convert the file to .wav
let output = execSync('ffmpeg -f f32le -ar 48000 -i audio.raw file.wav');
// play the file
let play = execSync('ffplay file.wav')
console.log(play);
// console.log("Output: \n", output)

// run node index and the process should run
