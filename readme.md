# ui-stream

## Usage
Install [nodejs](https://nodejs.org/) or [iojs](https://iojs.org/en/index.html), clone this repo
and do:

```
npm install
npm start
```

Then open `http://localhost:3000` or `http://your-ip:3000` in a modern web browser.

## Testing

Runs with static test image.

```
npm test
```

## Results

FullHD JPEG: ~45fps

## Protokol

Bytes<br>
`0 - 3` Magic Number (0xDEADBEEF)<br>
`4 - 7` Image Sequence Number<br>
`8 - 11` Frame Size<br>
`12 - 15` Packet Count<br>
`16 - 19` Packet Length<br>
`rest` Image Data
