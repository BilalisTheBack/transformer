import { Suspense, lazy, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { ThemeProvider } from "./providers/ThemeProvider";

// Lazy-loaded components
const Home = lazy(() => import("./features/home/Home"));
const Settings = lazy(() => import("./features/settings/Settings"));
const ImageConverter = lazy(() => import("./features/media/ImageConverter"));
const JsonCsvConverter = lazy(
  () => import("./features/converter/JsonCsvConverter")
);
const JsonToTsConverter = lazy(
  () => import("./features/converter/JsonToTsConverter")
);
const ConfigConverter = lazy(
  () => import("./features/converter/ConfigConverter")
);
const CurlConverter = lazy(() => import("./features/converter/CurlConverter"));
const SvgConverter = lazy(() => import("./features/media/SvgConverter"));
const ColorConverter = lazy(() => import("./features/media/ColorConverter"));
const OcrConverter = lazy(() => import("./features/media/OcrConverter"));
const ImageFormatConverter = lazy(
  () => import("./features/media/ImageFormatConverter")
);
const MarkdownConverter = lazy(
  () => import("./features/text/MarkdownConverter")
);
const TextDiffViewer = lazy(() => import("./features/text/TextDiffViewer"));
const LogAnalyzer = lazy(() => import("./features/text/LogAnalyzer"));
const LoremIpsumGenerator = lazy(
  () => import("./features/text/LoremIpsumGenerator")
);

const JwtDecoder = lazy(() => import("./features/developer/JwtDecoder"));
const Base64Converter = lazy(
  () => import("./features/developer/Base64Converter")
);
const EpochConverter = lazy(
  () => import("./features/developer/EpochConverter")
);
const JsonYamlConverter = lazy(
  () => import("./features/developer/JsonYamlConverter")
);
const SqlFormatter = lazy(() => import("./features/developer/SqlFormatter"));
const SeoGenerator = lazy(() => import("./features/developer/SeoGenerator"));
const MetadataViewer = lazy(
  () => import("./features/developer/MetadataViewer")
);
const RegexTester = lazy(() => import("./features/developer/RegexTester"));

const HashGenerator = lazy(() => import("./features/security/HashGenerator"));
const UuidGenerator = lazy(() => import("./features/security/UuidGenerator"));
const UrlEncoder = lazy(() => import("./features/security/UrlEncoder"));
const BrowserFingerprint = lazy(
  () => import("./features/security/BrowserFingerprint")
);
const PasswordGenerator = lazy(
  () => import("./features/security/PasswordGenerator")
);
const IpInfo = lazy(() => import("./features/network/IpInfo"));
const SpeedTest = lazy(() => import("./features/network/SpeedTest"));
const BgRemover = lazy(() => import("./features/media/BgRemover"));

const ColorPaletteGenerator = lazy(
  () => import("./features/visual/ColorPaletteGenerator")
);
const QrCodeGenerator = lazy(() => import("./features/visual/QrCodeGenerator"));
const BoxShadowGenerator = lazy(
  () => import("./features/visual/BoxShadowGenerator")
);
const XmlJsonConverter = lazy(
  () => import("./features/converters/XmlJsonConverter")
);
const ExcelCsvConverter = lazy(
  () => import("./features/converters/ExcelCsvConverter")
);
const ImageCompressor = lazy(() => import("./features/media/ImageCompressor"));
const ImageCropper = lazy(() => import("./features/media/ImageCropper"));
const ImageToPdf = lazy(() => import("./features/media/ImageToPdf"));
const PdfToImage = lazy(() => import("./features/media/PdfToImage"));
const ExifCleaner = lazy(() => import("./features/media/ExifCleaner"));
const CodeMinifier = lazy(() => import("./features/developer/CodeMinifier"));
const JsonValidator = lazy(() => import("./features/developer/JsonValidator"));
const CodeBeautifier = lazy(
  () => import("./features/developer/CodeBeautifier")
);
const TextCaseConverter = lazy(
  () => import("./features/text/TextCaseConverter")
);
const HttpStatusLookup = lazy(
  () => import("./features/developer/HttpStatusLookup")
);
const UserAgentParser = lazy(
  () => import("./features/developer/UserAgentParser")
);
const CronGenerator = lazy(() => import("./features/developer/CronGenerator"));
const EnvGenerator = lazy(() => import("./features/developer/EnvGenerator"));
const MockDataGenerator = lazy(
  () => import("./features/developer/MockDataGenerator")
);
const PasswordStrengthChecker = lazy(
  () => import("./features/security/PasswordStrengthChecker")
);
const JwtGenerator = lazy(() => import("./features/security/JwtGenerator"));
const CsrfTokenGenerator = lazy(
  () => import("./features/security/CsrfTokenGenerator")
);
const SecureKeyGenerator = lazy(
  () => import("./features/security/SecureKeyGenerator")
);
const EmailHeaderAnalyzer = lazy(
  () => import("./features/security/EmailHeaderAnalyzer")
);
const GradientGenerator = lazy(
  () => import("./features/css/GradientGenerator")
);
const GlassmorphismGenerator = lazy(
  () => import("./features/css/GlassmorphismGenerator")
);
const NeumorphismGenerator = lazy(
  () => import("./features/css/NeumorphismGenerator")
);
const CssClampGenerator = lazy(
  () => import("./features/css/CssClampGenerator")
);
const FontPairingTool = lazy(() => import("./features/css/FontPairingTool"));
const MindMap = lazy(() => import("./features/visual/MindMap"));

const MetaTagGenerator = lazy(() => import("./features/seo/MetaTagGenerator"));
const RobotsTxtGenerator = lazy(
  () => import("./features/seo/RobotsTxtGenerator")
);
const SitemapGenerator = lazy(() => import("./features/seo/SitemapGenerator"));
const PageSpeedChecklist = lazy(
  () => import("./features/seo/PageSpeedChecklist")
);
const SeoSnippetPreview = lazy(
  () => import("./features/seo/SeoSnippetPreview")
);

import { useRecentTools } from "./hooks/useRecentTools";
import ReloadPrompt from "./components/ReloadPrompt";

// Basic loading fallback
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

function App() {
  useRecentTools(); // Enable tracking

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <Suspense fallback={<LoadingFallback />}>
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

            {/* Network Tools */}
            <Route path="ip" element={<IpInfo />} />
            <Route path="speed-test" element={<SpeedTest />} />

            {/* Security Tools */}
            <Route path="hash" element={<HashGenerator />} />
            <Route path="uuid" element={<UuidGenerator />} />
            <Route path="url-encode" element={<UrlEncoder />} />
            <Route path="fingerprint" element={<BrowserFingerprint />} />
            <Route path="password" element={<PasswordGenerator />} />

            {/* Visual & CSS Tools */}
            <Route path="palette" element={<ColorPaletteGenerator />} />
            <Route path="/qr" element={<QrCodeGenerator />} />
            <Route path="/gradient" element={<GradientGenerator />} />
            <Route path="/glassmorphism" element={<GlassmorphismGenerator />} />
            <Route path="/neumorphism" element={<NeumorphismGenerator />} />
            <Route path="/clamp" element={<CssClampGenerator />} />
            <Route path="/font-pairing" element={<FontPairingTool />} />
            <Route path="/box-shadow" element={<BoxShadowGenerator />} />
            <Route path="/mind-map" element={<MindMap />} />

            {/* SEO & Web */}
            <Route path="/meta-tags" element={<MetaTagGenerator />} />
            <Route path="/robots-txt" element={<RobotsTxtGenerator />} />
            <Route path="/sitemap" element={<SitemapGenerator />} />
            <Route path="/page-speed" element={<PageSpeedChecklist />} />
            <Route path="/seo-preview" element={<SeoSnippetPreview />} />
          </Route>
        </Routes>
      </Suspense>
      {/* <ReloadPrompt /> */}
    </ThemeProvider>
  );
}

export default App;
