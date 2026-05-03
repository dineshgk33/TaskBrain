/**
 * Silences common benign browser extension errors that clutter the console.
 * Specifically targets the "A listener indicated an asynchronous response by returning true..." error
 * which is usually caused by password managers or other extensions interacting with forms.
 */
export const initGlobalErrorSuppressor = () => {
    if (typeof window === 'undefined') return;

    const originalError = console.error;

    console.error = (...args) => {
        const errorString = args[0] ? args[0].toString() : '';
        
        // Check for the specific extension error message
        if (
            errorString.includes('message channel closed before a response was received') ||
            errorString.includes('A listener indicated an asynchronous response by returning true')
        ) {
            // Log a more helpful message instead of the raw extension error
            console.debug('Suppressed a benign browser extension error regarding message channels.');
            return;
        }

        // Handle errors that are objects with message property
        if (args[0] && args[0].message && (
            args[0].message.includes('message channel closed before a response was received') ||
            args[0].message.includes('A listener indicated an asynchronous response by returning true')
        )) {
            console.debug('Suppressed a benign browser extension error object regarding message channels.');
            return;
        }

        originalError.apply(console, args);
    };

    // Also handle unhandledrejection for promises
    window.addEventListener('unhandledrejection', (event) => {
        const reason = event.reason ? event.reason.toString() : '';
        if (
            reason.includes('message channel closed before a response was received') ||
            reason.includes('A listener indicated an asynchronous response by returning true')
        ) {
            event.preventDefault();
            console.debug('Caught and suppressed an unhandled extension promise rejection.');
        }
    });
};
