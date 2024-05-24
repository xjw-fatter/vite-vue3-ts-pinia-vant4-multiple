export interface CommonType {
	[key: string]: any,
}

export type AppActionName =
	'canIUse' | 'closeWebview' | 'getInfo';

export interface BridgeInvokeCheckOptions {
	actionName: AppActionName,
	actionVersion?: string;
	params?: any;
	success?: Function;
}
export interface UserInfo {
	[key: string]: any,
}