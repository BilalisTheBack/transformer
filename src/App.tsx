import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Settings from "./features/settings/Settings";
import ImageConverter from "./features/media/ImageConverter";
import { DragDropProvider } from "./providers/DragDropProvider";
import { ThemeProvider } from "./providers/ThemeProvider";
import JsonCsvConverter from "./features/converter/JsonCsvConverter";
import JsonToTsConverter from "./features/converter/JsonToTsConverter";
import ConfigConverter from "./features/converter/ConfigConverter";
import CurlConverter from "./features/converter/CurlConverter";
import SvgConverter from "./features/media/SvgConverter";
import ColorConverter from "./features/media/ColorConverter";
import OcrConverter from "./features/media/OcrConverter";
import ImageFormatConverter from "./features/media/ImageFormatConverter";
import MarkdownConverter from "./features/text/MarkdownConverter";
import TextDiffViewer from "./features/text/TextDiffViewer";
import LogAnalyzer from "./features/text/LogAnalyzer";
import LoremIpsumGenerator from "./features/text/LoremIpsumGenerator";

// Developer Tools
import JwtDecoder from "./features/developer/JwtDecoder";
import Base64Converter from "./features/developer/Base64Converter";
import EpochConverter from "./features/developer/EpochConverter";
import JsonYamlConverter from "./features/developer/JsonYamlConverter";
import SqlFormatter from "./features/developer/SqlFormatter";
import SeoGenerator from "./features/developer/SeoGenerator";
import MetadataViewer from "./features/developer/MetadataViewer";
import RegexTester from "./features/developer/RegexTester";

// Security Tools
import HashGenerator from "./features/security/HashGenerator";
import UuidGenerator from "./features/security/UuidGenerator";
import UrlEncoder from "./features/security/UrlEncoder";
import BrowserFingerprint from "./features/security/BrowserFingerprint";
import PasswordGenerator from "./features/security/PasswordGenerator";
import IpInfo from "./features/network/IpInfo";
import BgRemover from "./features/media/BgRemover";

// Visual Tools
import ColorPaletteGenerator from "./features/visual/ColorPaletteGenerator";
import QrCodeGenerator from "./features/visual/QrCodeGenerator";
import BoxShadowGenerator from "./features/visual/BoxShadowGenerator";

// Placeholder components
import Home from "./features/home/Home";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <DragDropProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="settings" element={<Settings />} />
              <Route path="image-converter" element={<ImageConverter />} />
              <Route path="json-csv" element={<JsonCsvConverter />} />
              <Route path="json-ts" element={<JsonToTsConverter />} />
              <Route path="config" element={<ConfigConverter />} />
              <Route path="curl" element={<CurlConverter />} />
              <Route path="svg" element={<SvgConverter />} />
              <Route path="color" element={<ColorConverter />} />
              <Route path="ocr" element={<OcrConverter />} />
              <Route path="bg-remover" element={<BgRemover />} />
              <Route path="img-format" element={<ImageFormatConverter />} />
              <Route path="markdown" element={<MarkdownConverter />} />
              <Route path="diff" element={<TextDiffViewer />} />
              <Route path="log-analyzer" element={<LogAnalyzer />} />
              <Route path="lorem" element={<LoremIpsumGenerator />} />

              {/* Developer Tools */}
              <Route path="jwt" element={<JwtDecoder />} />
              <Route path="base64" element={<Base64Converter />} />
              <Route path="epoch" element={<EpochConverter />} />
              <Route path="json-yaml" element={<JsonYamlConverter />} />
              <Route path="sql" element={<SqlFormatter />} />
              <Route path="seo" element={<SeoGenerator />} />
              <Route path="metadata" element={<MetadataViewer />} />
              <Route path="regex" element={<RegexTester />} />

              {/* Security Tools */}
              <Route path="hash" element={<HashGenerator />} />
              <Route path="uuid" element={<UuidGenerator />} />
              <Route path="url-encode" element={<UrlEncoder />} />
              <Route path="fingerprint" element={<BrowserFingerprint />} />
              <Route path="password" element={<PasswordGenerator />} />
              <Route path="ip" element={<IpInfo />} />

              {/* Visual & CSS Tools */}
              <Route path="palette" element={<ColorPaletteGenerator />} />
              <Route path="qr" element={<QrCodeGenerator />} />
              <Route path="box-shadow" element={<BoxShadowGenerator />} />

              {/* We will add more routes as we build features */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </DragDropProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
