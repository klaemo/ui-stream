# ui-stream

## Usage
```
npm install
npm start
```

## Testing

```
npm test
```

## Results

FullHD JPEG: ~30fps

## Protokol

Bytes
`0 - 3` Magic Number (0xDEADBEEF)
`4 - 7` Image Sequence Number
`8 - 11` Frame Size
`12 - 15` Packet Count
`16 - 19` Packet Length
`rest` Image Data
