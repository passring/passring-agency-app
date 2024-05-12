import * as wasm from "./passring_wasm_bg.wasm";
import { __wbg_set_wasm } from "./passring_wasm_bg.js";
__wbg_set_wasm(wasm);
export * from "./passring_wasm_bg.js";
