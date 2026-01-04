import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Settings from "./features/settings/Settings";
import ImageConverter from "./features/media/ImageConverter";
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

import XmlJsonConverter from "./features/converters/XmlJsonConverter";
import ExcelCsvConverter from "./features/converters/ExcelCsvConverter";
import ImageCompressor from "./features/media/ImageCompressor";
import ImageCropper from "./features/media/ImageCropper";
import ImageToPdf from "./features/media/ImageToPdf";
import PdfToImage from "./features/media/PdfToImage";
import ExifCleaner from "./features/media/ExifCleaner";
import CodeMinifier from "./features/developer/CodeMinifier";
import JsonValidator from "./features/developer/JsonValidator";
import CodeBeautifier from "./features/developer/CodeBeautifier";
import TextCaseConverter from "./features/text/TextCaseConverter";
import HttpStatusLookup from "./features/developer/HttpStatusLookup";
import UserAgentParser from "./features/developer/UserAgentParser";
import CronGenerator from "./features/developer/CronGenerator";
import EnvGenerator from "./features/developer/EnvGenerator";
import MockDataGenerator from "./features/developer/MockDataGenerator";
import PasswordStrengthChecker from "./features/security/PasswordStrengthChecker";
import JwtGenerator from "./features/security/JwtGenerator";
import CsrfTokenGenerator from "./features/security/CsrfTokenGenerator";
import SecureKeyGenerator from "./features/security/SecureKeyGenerator";
import EmailHeaderAnalyzer from "./features/security/EmailHeaderAnalyzer";
import GradientGenerator from "./features/css/GradientGenerator";
import GlassmorphismGenerator from "./features/css/GlassmorphismGenerator";
import NeumorphismGenerator from "./features/css/NeumorphismGenerator";
import CssClampGenerator from "./features/css/CssClampGenerator";
import FontPairingTool from "./features/css/FontPairingTool";

// SEO Tools
import MetaTagGenerator from "./features/seo/MetaTagGenerator";
import RobotsTxtGenerator from "./features/seo/RobotsTxtGenerator";
import SitemapGenerator from "./features/seo/SitemapGenerator";
import PageSpeedChecklist from "./features/seo/PageSpeedChecklist";
import SeoSnippetPreview from "./features/seo/SeoSnippetPreview";

// Placeholder components
import Home from "./features/home/Home";

import { useRecentTools } from "./hooks/useRecentTools";

function App() {
  useRecentTools(); // Enable tracking

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
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
          <Route path="xml-json" element={<XmlJsonConverter />} />
          <Route path="excel-csv" element={<ExcelCsvConverter />} />
          <Route path="compress" element={<ImageCompressor />} />
          <Route path="crop" element={<ImageCropper />} />
          <Route path="img-pdf" element={<ImageToPdf />} />
          <Route path="pdf-img" element={<PdfToImage />} />
          <Route path="exif-cleaner" element={<ExifCleaner />} />
          <Route path="minifier" element={<CodeMinifier />} />
          <Route path="json-validator" element={<JsonValidator />} />
          <Route path="beautifier" element={<CodeBeautifier />} />
          <Route path="text-case" element={<TextCaseConverter />} />
          <Route path="http-status" element={<HttpStatusLookup />} />
          <Route path="user-agent" element={<UserAgentParser />} />
          <Route path="cron-generator" element={<CronGenerator />} />
          <Route path="env-generator" element={<EnvGenerator />} />
          <Route path="mock-data" element={<MockDataGenerator />} />
          <Route
            path="password-strength"
            element={<PasswordStrengthChecker />}
          />
          <Route path="jwt-generator" element={<JwtGenerator />} />
          <Route path="csrf-token" element={<CsrfTokenGenerator />} />
          <Route path="secure-key" element={<SecureKeyGenerator />} />
          <Route path="email-header" element={<EmailHeaderAnalyzer />} />
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
          <Route path="/qr" element={<QrCodeGenerator />} />
          <Route path="/gradient" element={<GradientGenerator />} />
          <Route path="/glassmorphism" element={<GlassmorphismGenerator />} />
          <Route path="/neumorphism" element={<NeumorphismGenerator />} />
          <Route path="/clamp" element={<CssClampGenerator />} />
          <Route path="/font-pairing" element={<FontPairingTool />} />
          <Route path="/box-shadow" element={<BoxShadowGenerator />} />

          {/* SEO & Web */}
          <Route path="/meta-tags" element={<MetaTagGenerator />} />
          <Route path="/robots-txt" element={<RobotsTxtGenerator />} />
          <Route path="/sitemap" element={<SitemapGenerator />} />
          <Route path="/page-speed" element={<PageSpeedChecklist />} />
          <Route path="/seo-preview" element={<SeoSnippetPreview />} />

          {/* We will add more routes as we build features */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
