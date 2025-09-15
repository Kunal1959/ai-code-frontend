const BACKEND_URL = "https://ai-code-backend-psi.vercel.app";

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
        // Note: Your backend returns 'code' not 'generatedCode'
        outputElement.textContent = data.code || 'No code generated';
        
        // Enable download functionality
        if (data.code) {
            const blob = new Blob([data.code], { type: 'text/plain' });
            downloadLink.href = URL.createObjectURL(blob);
            downloadLink.classList.remove('hidden');
        }
    } catch (error) {
        outputElement.textContent = `Error: ${error.message}`;
        console.error('API Error:', error);
    }
}
