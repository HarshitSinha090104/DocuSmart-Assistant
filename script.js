// --- 0. STATE MANAGEMENT & INITIALIZATION ---
let selectedFile = null;
let selectedLength = 'medium';

// Initialize PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

// --- 1. DOM ELEMENTS ---
const uploadZone = document.getElementById('uploadZone');
const fileSelector = document.getElementById('fileSelector');
const fileDisplay = document.getElementById('fileDisplay');
const fileNameElement = document.getElementById('fileName');
const fileSizeElement = document.getElementById('fileSize');
const generateButton = document.getElementById('generateButton');
const errorAlert = document.getElementById('errorAlert');
const loadingIndicator = document.getElementById('loadingIndicator');
const lengthButtons = document.querySelectorAll('.length-button');
const summaryPanel = document.getElementById('summaryPanel');
const summaryOutput = document.getElementById('summaryOutput');
const summaryLengthBadge = document.getElementById('summaryLength');
const copyButton = document.getElementById('copyButton');
const resetButton = document.getElementById('resetButton');

// --- 2. EVENT LISTENERS ---

// File Upload
uploadZone.addEventListener('click', () => fileSelector.click());
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});
uploadZone.addEventListener('dragleave', () => uploadZone.classList.remove('dragover'));
uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) handleFileSelection(files[0]);
});
fileSelector.addEventListener('change', (e) => {
    if (e.target.files.length > 0) handleFileSelection(e.target.files[0]);
});

// Summary Length Buttons
lengthButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        lengthButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedLength = btn.dataset.length;
    });
});

// Generate Summary
generateButton.addEventListener('click', async () => {
    if (!selectedFile) {
        showError('Please upload a document first.');
        return;
    }

    loadingIndicator.style.display = 'block';
    generateButton.disabled = true;
    summaryPanel.classList.remove('show');
    hideError();

    try {
        let extractedText = '';
        if (selectedFile.type === 'application/pdf') {
            extractedText = await extractTextFromPDF(selectedFile);
        } else if (selectedFile.type.startsWith('image/')) {
            extractedText = await extractTextFromImage(selectedFile);
        } else {
            throw new Error('Unsupported file type.');
        }

        if (!extractedText || extractedText.trim().length < 50) {
            throw new Error('Could not extract enough readable text from the document.');
        }

        // Call Cohere API for summary
        const summary = await getSummaryFromAPI(extractedText, selectedLength);
        displaySummary(summary);

    } catch (error) {
        showError(error.message);
        console.error(error);
    } finally {
        loadingIndicator.style.display = 'none';
        generateButton.disabled = false;
    }
});

// Copy Summary
copyButton.addEventListener('click', () => {
    const listItems = summaryOutput.querySelectorAll('li');
    const textToCopy = Array.from(listItems).map(li => `• ${li.textContent}`).join('\n');

    navigator.clipboard.writeText(textToCopy).then(() => {
        copyButton.textContent = '✓ Copied!';
        setTimeout(() => {
            copyButton.textContent = '📋 Copy';
        }, 2000);
    }).catch(() => showError('Failed to copy text.'));
});

// New Document
resetButton.addEventListener('click', () => {
    selectedFile = null;
    fileSelector.value = '';
    fileDisplay.style.display = 'none';
    summaryPanel.classList.remove('show');
    generateButton.disabled = true;
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// --- 3. CORE FUNCTIONS ---

function handleFileSelection(file) {
    selectedFile = file;
    const validTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];

    if (!validTypes.includes(file.type)) {
        showError('Please upload a PDF or image file (PNG, JPG, JPEG)');
        return;
    }

    fileNameElement.textContent = file.name;
    fileSizeElement.textContent = formatFileSize(file.size);
    fileDisplay.style.display = 'block';
    generateButton.disabled = false;
    summaryPanel.classList.remove('show');
    hideError();
}

async function extractTextFromPDF(file) {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer
    }).promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        fullText += textContent.items.map(item => item.str).join(' ') + '\n';
    }
    return fullText;
}

async function extractTextFromImage(file) {
    console.log('Starting OCR with Tesseract.js v5...');
    const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => console.log(m)
    });
    const ret = await worker.recognize(file);
    await worker.terminate();
    console.log('OCR completed.');
    return ret.data.text;
}

async function getSummaryFromAPI(text, length) {
    const API_KEY = "F8yERUI4tEWgsCtFcrSsGM8cpKXd7jNOSPWPBXfw"; 
    const API_URL = "https://api.cohere.ai/v1/summarize";

    let apiLength = (length === 'short' || length === 'long') ? length : 'medium';

    const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            text: text,
            length: apiLength,
            format: 'bullets',
            extractiveness: 'medium'
        }),
    });

    if (!response.ok) throw new Error(`API error: ${response.statusText}`);

    const data = await response.json();
    return data.summary.split('\n').filter(point => point.trim().length > 0);
}

function displaySummary(bulletPoints) {
    summaryOutput.innerHTML = '';
    const ul = document.createElement('ul');

    bulletPoints.forEach(point => {
        const li = document.createElement('li');
        li.textContent = point.trim();
        ul.appendChild(li);
    });

    summaryOutput.appendChild(ul);
    summaryLengthBadge.textContent = selectedLength;
    
    // Add the 'show' class to trigger animations
    summaryPanel.classList.add('show');
    
    summaryPanel.scrollIntoView({
        behavior: 'smooth'
    });
}

// --- 4. HELPERS ---

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' Bytes';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / 1048576).toFixed(2) + ' MB';
}

function showError(message) {
    errorAlert.textContent = message;
    errorAlert.style.display = 'block';
}

function hideError() {
    errorAlert.style.display = 'none';
}
