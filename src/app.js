function initializeCalculatorApp() {
    if (typeof document === 'undefined' || typeof window === 'undefined') {
        return;
    }

    if (!document.getElementById('addPlayer')) {
        return;
    }

    const calculatorInstance = new SevenWondersCalculator();
    window.calculator = calculatorInstance;

    const statsModal = document.getElementById('statsModal');

    window.addEventListener('click', (event) => {
        if (event.target === statsModal) {
            calculatorInstance.closeStatistics();
        }
        const gameDetailsModal = document.getElementById('gameDetailsModal');
        if (event.target === gameDetailsModal) {
            calculatorInstance.closeGameDetails();
        }
    });
}

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeCalculatorApp);
    } else {
        initializeCalculatorApp();
    }
}

