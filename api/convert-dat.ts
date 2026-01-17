import { checkBotId } from "botid/server";

/**
 * Robust & Optimized Bi-directional .DAT File Converter
 * Supports: .dat, .json, .csv, .txt, .text, .exe, .bin
 * Features: Sample-based detection, Binary pass-through, Error resilience.
 */

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb", // Increased for larger binary files
    },
  },
};

export default async function handler(req: any, res: any) {
  // 1. Security Check
  try {
    const verification = await checkBotId();
    if (verification.isBot) {
      return res.status(403).json({ error: "Access denied: Bot detected" });
    }
  } catch (e) {
    // Fallback if botid service is down or misconfigured (allow for now to ensure availability)
    console.warn("BotID check failed, proceeding with caution.");
  }

  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { fileContent, fileName, targetFormat } = req.body;

    if (!fileContent || !fileName || !targetFormat) {
      return res
        .status(400)
        .json({ error: "Missing required fields: content, name or format" });
    }

    // Decode base64 buffer
    const buffer = Buffer.from(fileContent, "base64");
    if (buffer.length > 10 * 1024 * 1024) {
      return res.status(413).json({ error: "File too large (max 10MB)" });
    }

    const fileExt = fileName.split(".").pop()?.toLowerCase() || "";
    const isBinarySource = ["exe", "bin", "dat"].includes(fileExt);

    let result: Buffer | string = "";
    let contentType: string = "application/octet-stream";
    let finalFileName: string = "";
    const baseName =
      fileName.substring(0, fileName.lastIndexOf(".")) || fileName;

    // --- CASE A: TO DAT (.exe, .bin, .json, .csv, .txt -> .dat) ---
    if (targetFormat.toLowerCase() === "dat") {
      if (["exe", "bin"].includes(fileExt)) {
        // Binary to DAT: Static pass-through (header preservation)
        result = buffer;
      } else {
        // Text/JSON to DAT: Structure as key=value
        const textContent = buffer.toString("utf-8").trim();
        try {
          if (fileExt === "json") {
            const parsed = JSON.parse(textContent);
            const dataArr = Array.isArray(parsed) ? parsed : [parsed];
            result = dataArr
              .map((item) =>
                Object.entries(item)
                  .map(([k, v]) => `${k}=${v}`)
                  .join("\n")
              )
              .join("\n\n---\n\n");
          } else {
            // CSV or Plain Text handling
            const lines = textContent.split(/\r?\n/).filter((l) => l.trim());
            if (
              lines.length > 0 &&
              (lines[0].includes(",") || lines[0].includes(";"))
            ) {
              const delimiter = lines[0].includes(";") ? ";" : ",";
              const headers = lines[0].split(delimiter).map((h) => h.trim());
              result = lines
                .slice(1)
                .map((line) => {
                  const values = line.split(delimiter).map((v) => v.trim());
                  return headers
                    .map((h, i) => `${h}=${values[i] || ""}`)
                    .join("\n");
                })
                .join("\n\n---\n\n");
            } else {
              result = textContent; // Plain text fallback
            }
          }
        } catch (e) {
          result = textContent; // Total fallback
        }
      }
      contentType = "application/octet-stream";
      finalFileName = `${baseName}.dat`;
    }
    // --- CASE B: FROM DAT (or binary) (.dat, .exe, .bin -> .json, .csv, .txt) ---
    else {
      const textContent = buffer.toString("utf-8");
      const lines = textContent
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l);

      // If no lines or clearly binary, we can't reliably "convert" to structured text
      if (lines.length === 0) {
        return res
          .status(400)
          .json({ error: "File content is not valid text for conversion" });
      }

      // Performance Optimization: Sample first 100 lines for detection
      const sample = lines.slice(0, 100);
      const isKeyValue =
        sample.length > 0 &&
        sample.every((l) => l.includes("=") || l.includes("---"));
      const isCsv =
        (!isKeyValue && sample[0]?.includes(",")) || sample[0]?.includes(";");

      let parsedData: any[] = [];

      if (isKeyValue) {
        // Split by sections if they exist
        const sections = textContent.split(/---\r?\n/);
        parsedData = sections
          .map((sec) => {
            const obj: any = {};
            sec
              .split(/\r?\n/)
              .filter((l) => l.includes("="))
              .forEach((line) => {
                const [k, ...v] = line.split("=");
                obj[k.trim()] = v.join("=").trim();
              });
            return obj;
          })
          .filter((o) => Object.keys(o).length > 0);
      } else if (isCsv) {
        const delimiter = lines[0].includes(";") ? ";" : ",";
        const headers = lines[0].split(delimiter).map((h) => h.trim());
        parsedData = lines.slice(1).map((line) => {
          const values = line.split(delimiter).map((v) => v.trim());
          const obj: any = {};
          headers.forEach((h, i) => {
            obj[h || `col_${i}`] = values[i] || "";
          });
          return obj;
        });
      } else {
        // Plain multi-line text
        parsedData = lines.map((l) => ({ line: l }));
      }

      switch (targetFormat.toLowerCase()) {
        case "json":
          result = JSON.stringify(parsedData, null, 2);
          contentType = "application/json";
          finalFileName = `${baseName}.json`;
          break;
        case "csv":
          if (parsedData.length > 0) {
            const keys = Object.keys(parsedData[0]);
            result = [
              keys.join(","),
              ...parsedData.map((row) =>
                keys
                  .map((k) => `"${String(row[k] || "").replace(/"/g, '""')}"`)
                  .join(",")
              ),
            ].join("\n");
          }
          contentType = "text/csv";
          finalFileName = `${baseName}.csv`;
          break;
        default:
          result = textContent;
          contentType = "text/plain";
          finalFileName = `${baseName}.txt`;
      }
    }

    res.setHeader("Content-Type", contentType);
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${finalFileName}"`
    );
    return res.status(200).send(result);
  } catch (error: any) {
    console.error("Critical Conversion Error:", error);
    return res
      .status(500)
      .json({ error: "Conversion failed: Internal Server Error" });
  }
}
