/// <reference types="node" />

export interface ImgDiffOptions {

  actualFilename?: string;
  actualReadStream?: NodeJS.ReadableStream;
  actualType?: string;

  expectedFilename?: string;
  expectedReadStream?: NodeJS.ReadableStream;
  expectedType?: string;

  diffWriteStream?: NodeJS.WritableStream;
  diffFilename?: string;

}

export interface ImgDiffResult {
  width: number;
  height: number;
  imagesAreSame: boolean;
  diffCount: number;
}

export function imgDiff(opt: ImgDiffOptions): ImgDiffResult;

export interface ImgDiffDecodeResult {
  width: number;
  height: number;
  data: Uint8Array;
}

export interface ImgDiffDecoder {
  decodeFile(filename: string): ImgDiffDecodeResult;

  decodeStream(stream: NodeJS.ReadableStream): ImgDiffDecodeResult;
}

export function registerDecoder(extensions: string[], decoder: ImgDiffDecoder);
