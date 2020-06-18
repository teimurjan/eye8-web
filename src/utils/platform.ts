import { safeWindow } from 'src/utils/dom';

export const isSafari = () => safeWindow(w => /safari/.test(w.navigator.userAgent.toLowerCase()), false);

export const isIOS = () => safeWindow(w => /iphone|ipod|ipad/.test(w.navigator.userAgent.toLowerCase()), false);

export const isInAppSafari = () => isIOS() && !isSafari();