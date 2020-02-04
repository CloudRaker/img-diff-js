/// <reference types="node" />

declare module '@cloudraker/img-diff-js' {

  export interface ImgDiffOptions {

    actualFilename?: string;
    actualReadStream?: NodeJS.ReadableStream;
    actualData?: Buffer;
    actualType?: keyof Decoders;

    expectedFilename?: string;
    expectedReadStream?: NodeJS.ReadableStream;
    expectedData?: Buffer;
    expectedType?: keyof Decoders;

    diffWriteStream?: NodeJS.WritableStream;
    diffFilename?: string;
    generateOnlyDiffFile?: boolean;

  }

  export interface ImgDiffResult {
    width: number;
    height: number;
    imagesAreSame: boolean;
    diffCount: number;
  }

  export function imgDiff(opt: ImgDiffOptions): Promise<ImgDiffResult>;

  export interface ImgDiffDecodeResult {
    width: number;
    height: number;
    data: Uint8Array;
  }

  export interface ImgDiffDecoder {
    decodeBuffer(buffer: Buffer): Promise<ImgDiffDecodeResult>;

    decodeStream(stream: NodeJS.ReadableStream): Promise<ImgDiffDecodeResult>;

    decodeFile(filename: string): Promise<ImgDiffDecodeResult>;
  }

  /**
   * Augment this interface & use `registerDecoder` to accept more formats.
   */
  export interface Decoders {
    'jpg': ImgDiffDecoder;
    'jpeg': ImgDiffDecoder;
    'png': ImgDiffDecoder;
  }

  export function registerDecoder(extensions: string[], decoder: ImgDiffDecoder);

}
