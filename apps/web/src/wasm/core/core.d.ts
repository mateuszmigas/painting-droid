/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} pixels
* @returns {Uint8Array}
*/
export function grayscale(pixels: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} pixels
* @returns {Uint8Array}
*/
export function sepia(pixels: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} pixels
* @param {number} width
* @param {number} height
* @param {number} new_width
* @param {number} new_height
* @returns {Uint8Array}
*/
export function resize(pixels: Uint8Array, width: number, height: number, new_width: number, new_height: number): Uint8Array;
/**
* @param {string} s
* @returns {string}
*/
export function greet(s: string): string;
/**
* Allowed pixel value range
*
* C.f. `VideoFullRangeFlag` variable specified in ISO/IEC 23091-4/ITU-T H.273
*/
export enum PixelRange {
/**
* Studio swing representation
*/
  Limited = 0,
/**
* Full swing representation
*/
  Full = 1,
}
/**
* Sample position for subsampled chroma
*/
export enum ChromaSamplePosition {
/**
* The source video transfer function must be signaled
* outside the AV1 bitstream.
*/
  Unknown = 0,
/**
* Horizontally co-located with (0, 0) luma sample, vertically positioned
* in the middle between two luma samples.
*/
  Vertical = 1,
/**
* Co-located with (0, 0) luma sample.
*/
  Colocated = 2,
}
/**
*/
export enum Tune {
  Psnr = 0,
  Psychovisual = 1,
}
/**
* Chroma subsampling format
*/
export enum ChromaSampling {
/**
* Both vertically and horizontally subsampled.
*/
  Cs420 = 0,
/**
* Horizontally subsampled.
*/
  Cs422 = 1,
/**
* Not subsampled.
*/
  Cs444 = 2,
/**
* Monochrome.
*/
  Cs400 = 3,
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly grayscale: (a: number, b: number, c: number) => void;
  readonly sepia: (a: number, b: number, c: number) => void;
  readonly resize: (a: number, b: number, c: number, d: number, e: number, f: number, g: number) => void;
  readonly greet: (a: number, b: number, c: number) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {SyncInitInput} module
*
* @returns {InitOutput}
*/
export function initSync(module: SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {InitInput | Promise<InitInput>} module_or_path
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: InitInput | Promise<InitInput>): Promise<InitOutput>;
