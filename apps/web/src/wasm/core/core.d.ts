/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} pixels
* @param {number} _width
* @param {number} _height
* @returns {Uint8Array}
*/
export function grayscale(pixels: Uint8Array, _width: number, _height: number): Uint8Array;
/**
* @param {Uint8Array} pixels
* @param {number} _width
* @param {number} _height
* @returns {Uint8Array}
*/
export function sepia(pixels: Uint8Array, _width: number, _height: number): Uint8Array;
/**
* @param {string} s
* @returns {string}
*/
export function greet(s: string): string;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly grayscale: (a: number, b: number, c: number, d: number, e: number) => void;
  readonly sepia: (a: number, b: number, c: number, d: number, e: number) => void;
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
