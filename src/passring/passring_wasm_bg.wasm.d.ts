/* tslint:disable */
/* eslint-disable */
export const memory: WebAssembly.Memory;
export function __wbg_passring_free(a: number): void;
export function passring_new(a: number, b: number, c: number, d: number): number;
export function passring_issue(a: number, b: number, c: number): number;
export function passring_validate(a: number, b: number): number;
export function passring_link(a: number, b: number, c: number): number;
export function get_random_ring(a: number, b: number): void;
export function strip_full_signature(a: number): number;
export function __wbg_privatekey_free(a: number): void;
export function privatekey_new(a: number, b: number): number;
export function privatekey_random(): number;
export function privatekey_getPublicKey(a: number): number;
export function privatekey_encodeHex(a: number, b: number): void;
export function privatekey_encodeHexUpper(a: number, b: number): void;
export function version(a: number): void;
export function init_panic_hook(): void;
export function __wbg_publickey_free(a: number): void;
export function publickey_new(a: number, b: number): number;
export function publickey_random(): number;
export function publickey_encodeHex(a: number, b: number): void;
export function publickey_encodeHexUpper(a: number, b: number): void;
export function __wbindgen_malloc(a: number, b: number): number;
export function __wbindgen_realloc(a: number, b: number, c: number, d: number): number;
export function __wbindgen_add_to_stack_pointer(a: number): number;
export function __wbindgen_free(a: number, b: number, c: number): void;
export function __wbindgen_exn_store(a: number): void;
