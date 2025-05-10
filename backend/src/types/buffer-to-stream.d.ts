/* eslint-disable prettier/prettier */
declare module 'buffer-to-stream' {
  import { Readable } from 'stream';
  export default function toStream(buffer: Buffer): Readable;
}