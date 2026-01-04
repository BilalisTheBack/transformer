# The Transformer ⚡

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-19-61dafb.svg?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue.svg?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-6-646cff.svg?style=flat&logo=vite)
![Offline Ready](https://img.shields.io/badge/Offline-Ready-green.svg)

**The Transformer** is the ultimate, privacy-focused Swiss Army Knife for developers, designers, and webmasters.

It runs **100% locally** in your browser. No data is ever sent to a server. Whether you need to decode a JWT, remove an image background with AI, or generate secure keys—it happens instantly on your device.

![Main Screenshot](mainpage.png)

## ✨ Why The Transformer?

- **🔒 Privacy First:** Your data (keys, images, passwords) never leaves your browser.
- **⚡ Blazing Fast:** Zero network latency. Built with Vite and WASM.
- **📦 Offline Capable:** Works without an internet connection.
- **🌍 Multi-language:** Fully localized in 8+ languages (EN, TR, ES, FR, DE, etc.).
- **🎨 Amazing UX:** System-wide dark mode, command palette (`Ctrl+K`), and drag-and-drop support.

## 🚀 Features at a Glance

The application packs **30+ tools** into a unified, beautiful interface:

### 🛠️ Developer Essentials

- **JWT Tools:** Decoder & Generator (with signature verification).
- **Converters:** JSON ↔ CSV/Excel, JSON ↔ YAML, XML ↔ JSON.
- **Generators:** UUIDs, Hashes (MD5/SHA), Cron Expressions, Mock Data.
- **Utils:** SQL Formatter, Base64, Epoch Timestamp, URL Encoder.

### 🖼️ Media & AI Studio

- **AI Background Remover:** Remove backgrounds locally using WASM.
- **Image Tools:** Converter (WebP/AVIF), Compressor, Resizer/Cropper.
- **OCR:** Extract text from images (supports multiple languages).
- **Privacy:** EXIF Metadata Cleaner (GPS removal).

### 🔐 Security & Network

- **Keys:** Generate cryptographically secure Passwords, API Keys, and CSRF Tokens.
- **Analysis:** Email Header Analyzer, Browser Fingerprinting.
- **Network:** IP Info, HTTP Status Codes, User-Agent Parser.

### 🔍 SEO & Web

- **Generators:** Meta Tags (OG/Twitter), Robots.txt, Sitemap.xml.
- **Checks:** Page Speed Checklist, SERP Preview.

## 📦 Tech Stack

Built with the latest and greatest web technologies:

- **Core:** [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React](https://lucide.dev/) (Icons)
- **State & Routing:** React Router v7, Custom Hooks
- **Key Libraries:** `i18next`, `@imgly/background-removal`, `tesseract.js`, `pdf-lib`, `papaparse`

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+
- npm or pnpm

### Installation

1.  **Clone the repo**

    ```bash
    git clone https://github.com/BilalisTheBack/transformer.git
    cd transformer
    ```

2.  **Install dependencies**

    ```bash
    npm install
    ```

3.  **Run locally**

    ```bash
    npm run dev
    ```

    Open `http://localhost:5173` in your browser.

4.  **Build for production**
    ```bash
    npm run build
    ```

## 🤝 Contributing

We love contributions! Whether it's a new tool idea, a bug fix, or a translation update.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/BilalisTheBack">BilalisTheBack</a>
</p>
