import { InjectionToken } from "@angular/core";
import { fabric } from "fabric";

const fabricInstance = fabric;

export const FABRIC_JS_TOKEN = new InjectionToken('fabric-instnce-token');
export function fabricProvider() {return fabricInstance;}