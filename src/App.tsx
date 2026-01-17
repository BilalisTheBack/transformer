import { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import { ThemeProvider } from "./providers/ThemeProvider";
import { FavoritesProvider } from "./providers/FavoritesProvider";

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
const DatConverter = lazy(() => import("./features/converter/DatConverter"));
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
const MediaDownloader = lazy(() => import("./features/media/MediaDownloader"));
const Mp4ToMp3Converter = lazy(
  () => import("./features/media/Mp4ToMp3Converter")
);
const VideoClipper = lazy(() => import("./features/media/VideoClipper"));

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
const ChmodCalculator = lazy(
  () => import("./features/developer/ChmodCalculator")
);
const GitignoreGenerator = lazy(
  () => import("./features/developer/GitignoreGenerator")
);
const SvgOptimizer = lazy(() => import("./features/media/SvgOptimizer"));
const FaviconGenerator = lazy(
  () => import("./features/media/FaviconGenerator")
);
const PdfTools = lazy(() => import("./features/media/PdfTools"));
const ClipPathMaker = lazy(() => import("./features/visual/ClipPathMaker"));
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

// Live Tools
const ApiTester = lazy(() => import("./features/live/ApiTester"));
const DnsSslChecker = lazy(() => import("./features/live/DnsSslChecker"));
const WebhookReceiver = lazy(() => import("./features/live/WebhookReceiver"));
const HttpReplay = lazy(() => import("./features/live/HttpReplay"));

// Security Pro Tools
const SecurityHeaders = lazy(
  () => import("./features/security-pro/SecurityHeaders")
);
const RateLimitSimulator = lazy(
  () => import("./features/security-pro/RateLimitSimulator")
);
const LiveJwtValidator = lazy(
  () => import("./features/security-pro/LiveJwtValidator")
);
const PasswordPolicyTester = lazy(
  () => import("./features/security-pro/PasswordPolicyTester")
);
const CspGenerator = lazy(() => import("./features/security-pro/CspGenerator"));

const SerpTracker = lazy(() => import("./features/seo/SerpTracker"));
const KeywordIntent = lazy(() => import("./features/seo/KeywordIntent"));
const AbTester = lazy(() => import("./features/seo/AbTester"));
const MetaCompare = lazy(() => import("./features/seo/MetaCompare"));
const BacklinkAnalyzer = lazy(() => import("./features/seo/BacklinkAnalyzer"));

const AiErrorHandler = lazy(() => import("./features/ai/AiErrorHandler"));
const AiLogAnalyzer = lazy(() => import("./features/ai/AiLogAnalyzer"));
const AiRegexExplainer = lazy(() => import("./features/ai/AiRegexExplainer"));
const AiApiExplainer = lazy(() => import("./features/ai/AiApiExplainer"));

const FlowBuilder = lazy(() => import("./features/ecosystem/FlowBuilder"));
const HistoryReplay = lazy(() => import("./features/ecosystem/HistoryReplay"));

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

// Premium loading fallback with "The Transformer" branding
const LoadingFallback = () => (
  <div className="fixed inset-0 flex flex-col items-center justify-center bg-app-bg z-50 overflow-hidden">
    {/* Animated background glow */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-app-primary/10 rounded-full blur-[100px] animate-pulse" />

    <div className="relative flex flex-col items-center gap-8">
      {/* Premium Gradient Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-app-border/10" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-app-primary border-r-purple-500 animate-spin shadow-[0_0_15px_rgba(0,212,255,0.3)]" />
      </div>

      {/* Branded Text */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 animate-pulse">
          The Transformer
        </h2>
        <div className="h-1 w-32 bg-app-border rounded-full overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 w-1/2 animate-[loadingBar_2s_infinite_ease-in-out]" />
        </div>
      </div>
    </div>

    <style>{`
      @keyframes loadingBar {
        0% { transform: translateX(-100%); width: 30%; }
        50% { transform: translateX(50%); width: 60%; }
        100% { transform: translateX(200%); width: 30%; }
      }
    `}</style>
  </div>
);

// Fallback component
const UnderConstruction = lazy(() => import("./components/UnderConstruction"));

function App() {
  useRecentTools(); // Enable tracking

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      <FavoritesProvider>
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
              <Route path="dat-converter" element={<DatConverter />} />
              <Route path="svg" element={<SvgConverter />} />
              <Route path="color" element={<ColorConverter />} />
              <Route path="ocr" element={<OcrConverter />} />
              <Route path="bg-remover" element={<BgRemover />} />
              <Route path="media-downloader" element={<MediaDownloader />} />
              <Route path="mp4-to-mp3" element={<Mp4ToMp3Converter />} />
              <Route path="video-clipper" element={<VideoClipper />} />
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
              <Route path="chmod" element={<ChmodCalculator />} />
              <Route path="gitignore" element={<GitignoreGenerator />} />
              <Route path="favicon" element={<FaviconGenerator />} />
              <Route path="pdf-tools" element={<PdfTools />} />
              <Route path="svg-optimizer" element={<SvgOptimizer />} />
              <Route path="clip-path" element={<ClipPathMaker />} />
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
              <Route path="qr" element={<QrCodeGenerator />} />
              <Route path="gradient" element={<GradientGenerator />} />
              <Route
                path="glassmorphism"
                element={<GlassmorphismGenerator />}
              />
              <Route path="neumorphism" element={<NeumorphismGenerator />} />
              <Route path="clamp" element={<CssClampGenerator />} />
              <Route path="font-pairing" element={<FontPairingTool />} />
              <Route path="box-shadow" element={<BoxShadowGenerator />} />
              <Route path="mind-map" element={<MindMap />} />

              {/* SEO & Web */}
              <Route path="meta-tags" element={<MetaTagGenerator />} />
              <Route path="robots-txt" element={<RobotsTxtGenerator />} />
              <Route path="sitemap" element={<SitemapGenerator />} />
              <Route path="page-speed" element={<PageSpeedChecklist />} />
              <Route path="seo-preview" element={<SeoSnippetPreview />} />

              {/* Live Tools */}
              <Route path="api-tester" element={<ApiTester />} />
              <Route path="dns-ssl" element={<DnsSslChecker />} />
              <Route path="webhook" element={<WebhookReceiver />} />
              <Route path="http-replay" element={<HttpReplay />} />

              {/* Security Pro Tools */}
              <Route path="security-headers" element={<SecurityHeaders />} />
              <Route path="csp" element={<CspGenerator />} />
              <Route path="rate-limit" element={<RateLimitSimulator />} />
              <Route path="jwt-live" element={<LiveJwtValidator />} />
              <Route
                path="password-policy"
                element={<PasswordPolicyTester />}
              />

              {/* SEO & Growth Tools */}
              <Route path="serp" element={<SerpTracker />} />
              <Route path="keyword-intent" element={<KeywordIntent />} />
              <Route path="ab-tester" element={<AbTester />} />
              <Route path="meta-compare" element={<MetaCompare />} />
              <Route path="backlink" element={<BacklinkAnalyzer />} />

              {/* AI Tools */}
              <Route path="ai-error" element={<AiErrorHandler />} />
              <Route path="ai-log" element={<AiLogAnalyzer />} />
              <Route path="ai-regex" element={<AiRegexExplainer />} />
              <Route path="ai-api" element={<AiApiExplainer />} />

              {/* Ecosystem */}
              <Route path="flow" element={<FlowBuilder />} />
              <Route path="history" element={<HistoryReplay />} />
            </Route>
            {/* Catch-all Not Found */}
            <Route path="*" element={<UnderConstruction />} />
          </Routes>
        </Suspense>
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
