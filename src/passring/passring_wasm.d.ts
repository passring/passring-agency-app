/* tslint:disable */
/* eslint-disable */
/**
* @param {number} size
* @returns {(PublicKey)[]}
*/
export function get_random_ring(size: number): (PublicKey)[];
/**
* @param {any} full_signature
* @returns {any}
*/
export function strip_full_signature(full_signature: any): any;
/**
*/
export function init_panic_hook(): void;
/**
* @returns {string}
*/
export function version(): string;
/**
*/
export class Passring {
  free(): void;
/**
* @param {string} voting_id
* @param {(PublicKey)[]} ring
*/
  constructor(voting_id: string, ring: (PublicKey)[]);
/**
* @param {number} choice
* @param {PrivateKey} private_key
* @returns {any}
*/
  issue(choice: number, private_key: PrivateKey): any;
/**
* @param {any} full_signature
* @returns {boolean}
*/
  validate(full_signature: any): boolean;
/**
* @param {any} full_signature_1
* @param {any} full_signature_2
* @returns {boolean}
*/
  link(full_signature_1: any, full_signature_2: any): boolean;
}
/**
*/
export class PrivateKey {
  free(): void;
/**
* @param {string} hex
*/
  constructor(hex: string);
/**
* @returns {PrivateKey}
*/
  static random(): PrivateKey;
/**
* @returns {PublicKey}
*/
  getPublicKey(): PublicKey;
/**
* @returns {string}
*/
  encodeHex(): string;
/**
* @returns {string}
*/
  encodeHexUpper(): string;
}
/**
*/
export class PublicKey {
  free(): void;
/**
* @param {string} hex
*/
  constructor(hex: string);
/**
* @returns {PublicKey}
*/
  static random(): PublicKey;
/**
* @returns {string}
*/
  encodeHex(): string;
/**
* @returns {string}
*/
  encodeHexUpper(): string;
}
