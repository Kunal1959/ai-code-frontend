const BACKEND_URL = 'REPLACE_WITH_YOUR_VERCEL_URL';

// Function to handle code generation
async function generateCode() {
    const inputText = document.getElementById('inputText').value;
    const language = document.getElementById('languageSelect').value;
    const taskType = document.getElementById('taskTypeSelect').value;
    const outputElement = document.getElementById('output');
    const downloadLink = document.getElementById('downloadLink');

    // Reset UI elements
    outputElement.textContent = 'Loading...';
    downloadLink.classList.add('hidden');

    try {
        const response = await fetch(`${BACKEND_URL}/api/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: inputText,
                language: language,
                taskType: taskType
            })
        });

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}: ${await response.text()}`);
        }

        const data = await response.json();
        
        // Display the generated code
        outputElement.textContent = data.generatedCode || 'No code generated';
        
        // Enable download functionality
        if (data.generatedCode) {
            const blob = new Blob([data.generatedCode], { type: 'text/plain' });
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.classList.remove('hidden');
        }
    } catch (error) {
        outputElement.textContent = `Error: ${error.message}`;
    }
}
/*
 * JSZip CDN: https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js
 *
 * Example usage:
 *   const files = {
 *     'file1.txt': 'Hello, world!',
 *     'file2.js': 'console.log("Hello from JS file!");'
 *   };
 *   downloadZip(files, 'myfiles.zip');
 */

function downloadZip(filesObj, zipFilename = 'files.zip') {
    if (typeof JSZip === 'undefined') {
        alert('JSZip is not loaded. Please include JSZip via CDN.');
        return;
    }
    const zip = new JSZip();
    for (const [filename, content] of Object.entries(filesObj)) {
        zip.file(filename, content);
    }
    zip.generateAsync({ type: 'blob' }).then(function (blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = zipFilename;
        document.body.appendChild(link);
        link.click();
        setTimeout(() => {
            URL.revokeObjectURL(link.href);
            document.body.removeChild(link);
        }, 100);
    });
}