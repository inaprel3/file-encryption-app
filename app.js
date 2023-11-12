document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('fileInput');
    const encryptButton = document.getElementById('encryptButton');
    const decryptButton = document.getElementById('decryptButton');
    const outputText = document.getElementById('outputText');
    const keyInput = document.getElementById('keyInput');

    let originalText = '';

    fileInput.addEventListener('change', (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (e) => {
            originalText = e.target.result;
        };

        reader.readAsText(file);
    });

    encryptButton.addEventListener('click', () => {
        if (originalText && keyInput.value) {
            const encrypted = encrypt(originalText, keyInput.value);
            outputText.textContent = encrypted;

            // Зберігаємо результат у вихідний файл
            const blob = new Blob([encrypted], { type: 'text/plain' });
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(blob);
            a.download = 'output.txt';
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    });

    decryptButton.addEventListener('click', () => {
        if (originalText && keyInput.value) {
            const decrypted = decrypt(originalText, keyInput.value);
            outputText.textContent = decrypted;
        }
    });

    function encryptLetter(char, keyChar) {
        const charCode = char.charCodeAt(0);
        const keyCharCode = keyChar.charCodeAt(0);
        const isUpperCase = char === char.toUpperCase();
        let resultCharCode;

        if (isUpperCase) {
            resultCharCode = ((charCode - 65 + keyCharCode - 65) % 26) + 65;
        } else {
            resultCharCode = ((charCode - 97 + keyCharCode - 97) % 26) + 97;
        }

        return String.fromCharCode(resultCharCode);
    }

    function decryptLetter(char, keyChar) {
        const charCode = char.charCodeAt(0);
        const keyCharCode = keyChar.charCodeAt(0);
        const isUpperCase = char === char.toUpperCase();
        let resultCharCode;

        if (isUpperCase) {
            resultCharCode = ((charCode - 65 - (keyCharCode - 65) + 26) % 26) + 65;
        } else {
            resultCharCode = ((charCode - 97 - (keyCharCode - 97) + 26) % 26) + 97;
        }

        return String.fromCharCode(resultCharCode);
    }

    function encryptDigit(char, keyChar) {
        const charCode = char.charCodeAt(0);
        const keyCharCode = keyChar.charCodeAt(0);
        const offset = keyCharCode - 65;
        const resultCharCode = ((charCode - 48 + offset) % 10) + 48;
        return String.fromCharCode(resultCharCode);
    }

    function decryptDigit(char, keyChar) {
        const charCode = char.charCodeAt(0);
        const keyCharCode = keyChar.charCodeAt(0);
        const offset = keyCharCode - 65;
        let resultCharCode = charCode - offset;
    
        if (isUpperCase(char)) {
            resultCharCode = ((charCode - 48 - offset + 10) % 10) + 48;
        } else {
            resultCharCode = ((charCode - 48 - offset + 10) % 10) + 48;
        }
    
        return String.fromCharCode(resultCharCode);
    }
    
    function isUpperCase(char) {
        return char === char.toUpperCase();
    }    
    
    function encrypt(text, key) {
        let encryptedText = '';
        let keyIndex = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (isLetter(char)) {
                encryptedText += encryptLetter(char, key[keyIndex]);
                keyIndex = (keyIndex + 1) % key.length;
            } else if (isDigit(char)) {
                encryptedText += encryptDigit(char, key[keyIndex]);
                keyIndex = (keyIndex + 1) % key.length;
            } else {
                encryptedText += char; // Залишити символи, які не є буквами або цифрами, без змін
            }
        }
        return encryptedText;
    }

    function decrypt(text, key) {
        let decryptedText = '';
        let keyIndex = 0;
        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            if (isLetter(char)) {
                decryptedText += decryptLetter(char, key[keyIndex]);
                keyIndex = (keyIndex + 1) % key.length;
            } else if (isDigit(char)) {
                decryptedText += decryptDigit(char, key[keyIndex]);
                keyIndex = (keyIndex + 1) % key.length;
            } else {
                decryptedText += char; // Залишити символи, які не є буквами або цифрами, без змін
            }
        }
        return decryptedText;
    }

    function isLetter(char) {
        return (char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z');
    }

    function isDigit(char) {
        return char >= '0' && char <= '9';
    }
});