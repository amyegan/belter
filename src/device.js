/* @flow */
import { iPhoneScreenHeightMatrix } from './screenHeights';

export function getUserAgent() : string {
    return window.navigator.mockUserAgent || window.navigator.userAgent; // eslint-disable-line compat/compat
}

export function isDevice(userAgent? : string = getUserAgent()) : boolean {
    if (userAgent.match(/Android|webOS|iPhone|iPad|iPod|bada|Symbian|Palm|CriOS|BlackBerry|IEMobile|WindowsMobile|Opera Mini/i)) {
        return true;
    }

    return false;
}

export function isWebView() : boolean {
    const userAgent = getUserAgent();
    return (/(iPhone|iPod|iPad|Macintosh).*AppleWebKit(?!.*Safari)|.*WKWebView/i).test(userAgent) ||
        (/\bwv\b/).test(userAgent) ||
    (/Android.*Version\/(\d)\.(\d)/i).test(userAgent);
}

export function isStandAlone() : boolean {
    return (window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches); // eslint-disable-line compat/compat
}

export function isFacebookWebView(ua? : string = getUserAgent()) : boolean {
    return (/FBAN/).test(ua) || (/FBAV/).test(ua);
}

export function isFirefoxIOS(ua? : string = getUserAgent()) : boolean {
    return (/FxiOS/i).test(ua);
}

export function isEdgeIOS(ua? : string = getUserAgent()) : boolean {
    return (/EdgiOS/i).test(ua);
}

export function isOperaMini(ua? : string = getUserAgent()) : boolean {
    return (/Opera Mini/i).test(ua);
}

export function isAndroid(ua? : string = getUserAgent()) : boolean {
    return (/Android/).test(ua);
}

export function isIos(ua? : string = getUserAgent()) : boolean {
    return (/iPhone|iPod|iPad/).test(ua);
}

export function isGoogleSearchApp(ua? : string = getUserAgent()) : boolean {
    return (/\bGSA\b/).test(ua);
}

export function isQQBrowser(ua? : string = getUserAgent()) : boolean {
    return (/QQBrowser/).test(ua);
}

export function isIosWebview(ua? : string = getUserAgent()) : boolean {
    if (isIos(ua)) {
        if (isGoogleSearchApp(ua)) {
            return true;
        }
        return (/.+AppleWebKit(?!.*Safari)|.*WKWebView/).test(ua);
    }
    return false;
}

export function isSFVC(ua? : string = getUserAgent()) : boolean {
    if (isIos(ua)) {
        const device = iPhoneScreenHeightMatrix[window.outerHeight];
        if (!device) {
            return false;
        }

        const height = window.innerHeight;
        const scale = Math.round(window.screen.width / window.innerWidth * 100) / 100;
        const computedHeight = Math.round(height * scale);

        if (scale > 1 && device.zoomHeight[scale]) {
            return device.zoomHeight[scale].indexOf(computedHeight) !== -1;
        } else {
            return device.textSizeHeights.indexOf(computedHeight) !== -1;
        }
    }
    return false;
}

export function isSFVCorSafari(ua? : string = getUserAgent()) : boolean {
    if (isIos(ua)) {
        const sfvc = isSFVC(ua);

        const device = iPhoneScreenHeightMatrix[window.outerHeight];
        if (!device) {
            return false;
        }

        const height = window.innerHeight;
        const scale = Math.round(window.screen.width / window.innerWidth * 100) / 100;

        const computedHeight = Math.round(height * scale);
        const possibleSafariSizes = device.maybeSafari;

        let maybeSafari = false;
        if (scale > 1 &&
            possibleSafariSizes[scale] &&
            possibleSafariSizes[scale].indexOf(computedHeight) !== -1) {
                
            maybeSafari = true;
        }

        return sfvc || maybeSafari;
    }
    return false;
}

export function isAndroidWebview(ua? : string = getUserAgent()) : boolean {
    if (isAndroid(ua)) {
        return (/Version\/[\d.]+/).test(ua) && !isOperaMini(ua);
    }
    return false;
}

export function isIE() : boolean {

    if (window.document.documentMode) {
        return true;
    }

    return Boolean(
        window.navigator && // eslint-disable-line compat/compat
        window.navigator.userAgent && // eslint-disable-line compat/compat
        (/Edge|MSIE|rv:11/i).test(window.navigator.userAgent) // eslint-disable-line compat/compat
    );
}

export function isIECompHeader() : boolean {
    const mHttp = window.document.querySelector('meta[http-equiv="X-UA-Compatible"]');
    const mContent = window.document.querySelector('meta[content="IE=edge"]');
    if (mHttp && mContent) {
        return true;
    }
    return false;
}

export function isElectron() : boolean {
    if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
        return true;
    }
    return false;
}

export function isIEIntranet() : boolean {

    // This status check only works for older versions of IE with document.documentMode set

    if (window.document.documentMode) {
        try {
            const status = window.status;

            window.status = 'testIntranetMode';

            if (window.status === 'testIntranetMode') {
                window.status = status;

                return true;
            }

            return false;

        } catch (err) {

            return false;
        }
    }

    return false;
}

export function isMacOsCna() : boolean {
    const userAgent = getUserAgent();
    return (/Macintosh.*AppleWebKit(?!.*Safari)/i).test(userAgent);
}

export function supportsPopups(ua? : string = getUserAgent()) : boolean {
    return !(isIosWebview(ua) || isAndroidWebview(ua) || isOperaMini(ua) ||
        isFirefoxIOS(ua) || isEdgeIOS(ua) || isFacebookWebView(ua) || isQQBrowser(ua) || isElectron() || isMacOsCna() || isStandAlone());
}

export function isChrome(ua? : string = getUserAgent()) : boolean {
    return (/Chrome|Chromium|CriOS/).test(ua);
}

export function isSafari(ua? : string = getUserAgent()) : boolean {
    return (/Safari/).test(ua) && !isChrome(ua);
}

export function isApplePaySupported() : boolean {
    if (window.ApplePaySession && window.ApplePaySession.canMakePayments()) {
        return true;
    }

    return false;
}
