/* tslint:disable */
/* eslint-disable */
/**
* @param {Uint8Array} data
* @returns {Uint8Array}
*/
export function grayscale(data: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} data
* @returns {Uint8Array}
*/
export function sepia(data: Uint8Array): Uint8Array;
/**
* @param {Uint8Array} data
* @param {number} width
* @param {number} height
* @param {number} start_x
* @param {number} start_y
* @param {number} r
* @param {number} g
* @param {number} b
* @param {number} a
* @param {number} tolerance
* @returns {Uint8Array}
*/
export function flood_fill(
  data: Uint8Array,
  width: number,
  height: number,
  start_x: number,
  start_y: number,
  r: number,
  g: number,
  b: number,
  a: number,
  tolerance: number
): Uint8Array;

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly grayscale: (a: number, b: number, c: number) => void;
  readonly sepia: (a: number, b: number, c: number) => void;
  readonly flood_fill: (
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number,
    g: number,
    h: number,
    i: number,
    j: number
  ) => void;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
