# Raw audio
Wherein I create an audio file from scratch, and read it with FFMPEG

## Learning and reflection
Generated numbers to create an audio waveform. 

## Run instructions
`git clone git@github.com:DevinCLane/raw-audio.git`

cd into project

to generate new audio, run `node index`

install ffmpeg if you don't already have it`

in the project directory run `ffplay -f f32le -ar 48000 audio.raw` 