# ✨ DocuSmart Assistant 

🔗 **Live Demo:** [document-summarizer-ten.vercel.app](https://document-summarizer-ten.vercel.app/)  

An interactive web application that turns **PDF and image documents** into clear, concise summaries using **AI-powered text extraction and summarization**.  

---

## 🖥️ How It Works  

1. **Upload** → Drag & drop or browse a PDF/image  
2. **Choose** → Select summary length (short / medium / long)  
3. **Process** → Extract text + generate AI summary  
4. **Review** → Copy or use the clean, bullet-point summary  

---

## ✨ Features  

### 📂 Document Handling  
- Drag & Drop upload with instant feedback  
- Supports **PDF, PNG, JPG, JPEG** formats  
- File validation with helpful error messages  

### 🔍 Text Extraction  
- **PDF.js** for reliable PDF parsing  
- **Tesseract.js OCR** for scanned images  
- Handles **multi-page** documents  

### 🤖 Summarization  
- Powered by **Cohere API**  
- Short, Medium, or Long summaries  
- Bullet-point structure for easy reading  
- One-click copy to clipboard  

### 🎨 User Experience  
- Responsive layout for all devices  
- Loading indicators for progress feedback  
- Modern, minimal interface with smooth interactions  
- Comprehensive error handling  

---

## 🛠️ Tech Stack  

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)  
- **Libraries:**  
  - [PDF.js](https://mozilla.github.io/pdf.js/) – PDF parsing  
  - [Tesseract.js](https://tesseract.projectnaptha.com/) – OCR  
- **AI Service:** [Cohere Summarization API](https://cohere.com/)  
- **Deployment:** [Vercel](https://vercel.com/)  

---

## 📸 Screenshots  

| Upload Document | Select Options | Generated Summary |  
| :-------------: | :------------: | :---------------: |  
| ![Upload Screenshot](https://github.com/user-attachments/assets/62668a21-7baa-40ee-94b8-033bc4d4c5d9) | ![Options Screenshot](https://github.com/user-attachments/assets/2b15a077-f354-44cf-8a65-57fc8ff76248) | ![Summary Screenshot](https://github.com/user-attachments/assets/9c2e8879-70b2-4f21-bdc5-7f4ec731a48a) |  



---

## ⚙️ Design & Technical Approach  

- **Client-Side Processing:** Ensures privacy by handling text extraction in the browser.  
- **Architecture:** Lightweight SPA with progressive flow (Upload → Extract → Summarize).  
- **Performance:** Progressive loading states, efficient OCR, and graceful error recovery.  
- **Why Vanilla JS?** Minimal bundle size, faster load times, and simpler deployment.  

---

## 🌍 Browser Support  

- ✅ Chrome (recommended)  
- ✅ Firefox  
- ✅ Safari  
- ✅ Edge  
- 📱 Mobile browsers supported  

---

## 🔒 Security  

> For demo purposes, the Cohere API key is included in client code.  
> In production, API keys should be secured on a backend or serverless proxy.  

---

## 🚀 Run Locally  

```bash
# Clone the repository
git clone https://github.com/your-username/document-summary-assistant.git
cd document-summary-assistant

# Open in VS Code
# Install the Live Server extension
# Right-click index.html → Open with Live Server
