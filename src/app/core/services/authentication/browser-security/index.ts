/**
 * @description prevent default
 */
export function preventDefault(): void {
    window.document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
    });
}

/**
 * @description prevent developer tool access
 */
export function preventDeveloperToolAccess() {
    window.document.onkeydown = function (e: KeyboardEvent) {
        if (e.keyCode == 123) {
            return false;
        } else if (e.ctrlKey && e.shiftKey && (e.keyCode == 'I'.charCodeAt(0) || e.keyCode == 'i'.charCodeAt(0))) {
            return false;
        } else if (e.ctrlKey && e.shiftKey && (e.keyCode == 'C'.charCodeAt(0) || e.keyCode == 'c'.charCodeAt(0))) {
            return false;
        } else if (e.ctrlKey && e.shiftKey && (e.keyCode == 'J'.charCodeAt(0) || e.keyCode == 'j'.charCodeAt(0))) {
            return false;
        } else if (e.ctrlKey && (e.keyCode == 'U'.charCodeAt(0) || e.keyCode == 'u'.charCodeAt(0))) {
            return false;
        } else if (e.ctrlKey && (e.keyCode == 'S'.charCodeAt(0) || e.keyCode == 's'.charCodeAt(0))) {
            return false;
        } else {
            return true;
        }
    }
}