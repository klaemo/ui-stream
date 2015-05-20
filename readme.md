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

Bytes<br>
`0 - 3` Magic Number (0xDEADBEEF)<br>
`4 - 7` Image Sequence Number<br>
`8 - 11` Frame Size<br>
`12 - 15` Packet Count<br>
`16 - 19` Packet Length<br>
`rest` Image Data
