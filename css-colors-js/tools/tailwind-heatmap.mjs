#!/usr/bin/env node
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Script } from "node:vm";

const SHADE_LABELS = [
    "50",
    "100",
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "800",
    "900",
    "950"
];

async function main() {
    const [exportPathArg, outputPathArg] = process.argv.slice(2);
    if (!exportPathArg) {
        console.error(
            "Usage: node tools/tailwind-heatmap.mjs <export.json> [output.html]"
        );
        process.exitCode = 1;
        return;
    }

    const exportPath = path.resolve(process.cwd(), exportPathArg);
    const exportData = JSON.parse(await readFile(exportPath, "utf8"));
    if (exportData?.palette !== "tailwind") {
        console.warn(
            `Warning: export palette is '${exportData?.palette}'. Tailwind comparison works best with a Tailwind export.`
        );
    }
    const { map: ourMap, order, labels } = buildLocalSwatchMap(exportData);
    const tailwindMap = await buildTailwindReference();

    const diff = computeDifferences(ourMap, tailwindMap, order, labels);
    const html = renderHtml(diff);

    const outputPath = path.resolve(
        process.cwd(),
        outputPathArg || "tailwind-diff.html"
    );
    await writeFile(outputPath, html, "utf8");

    console.log(`Heatmap written to ${outputPath}`);
}

function buildLocalSwatchMap(exportData) {
    const hues = exportData?.hueSwatches;
    if (!Array.isArray(hues)) {
        return { map: {}, order: [], labels: {} };
    }
    const map = {};
    const order = [];
    const labels = {};
    hues.forEach((row) => {
        if (!row || !row.name || !Array.isArray(row.shades)) {
            return;
        }
        const key = row.name.toLowerCase();
        const shades = {};
        row.shades.forEach((shade) => {
            if (!shade?.label) {
                return;
            }
            shades[shade.label] = {
                hue: Number(shade.hue) || 0,
                saturation: Number(shade.saturation) || 0,
                lightness: Number(shade.lightness) || 0
            };
        });
        if (!labels[key]) {
            labels[key] = row.name;
            order.push(key);
        }
        map[key] = shades;
    });
    return { map, order, labels };
}

async function buildTailwindReference() {
    if (typeof fetch !== "function") {
        const { default: fetchFn } = await import("node-fetch");
        globalThis.fetch = fetchFn;
    }
    const response = await fetch(
        "https://unpkg.com/tailwindcss@3.4.15/lib/public/colors.js"
    );
    if (!response.ok) {
        throw new Error(`Failed to download tailwind colors: ${response.status}`);
    }
    const source = await response.text();
    const sandbox = {
        module: { exports: {} },
        exports: {},
        require: (specifier) => {
            if (specifier === "../util/log") {
                return {
                    __esModule: true,
                    default: { warn: () => {} },
                    warn: () => {}
                };
            }
            throw new Error(`Unsupported require in sandbox: ${specifier}`);
        }
    };
    new Script(
        `${source}\nmodule.exports = exports.default || module.exports.default || exports.default || exports;`
    ).runInNewContext(sandbox);
    const exported
        = sandbox.module?.exports?.default
            ?? sandbox.module?.exports
            ?? sandbox.exports?.default
            ?? sandbox.exports;
    if (!exported || typeof exported !== "object") {
        throw new Error("Could not resolve Tailwind color data");
    }
    const colors = exported;
    const map = {};
    Object.entries(colors || {}).forEach(([name, entry]) => {
        if (!entry || typeof entry !== "object") {
            return;
        }
        if (
            !SHADE_LABELS.every(label =>
                Object.prototype.hasOwnProperty.call(entry, label)
            )
        ) {
            return;
        }
        const shadeMap = {};
        SHADE_LABELS.forEach((label) => {
            const hex = entry[label];
            shadeMap[label] = hexToHsl(hex);
        });
        map[name.toLowerCase()] = shadeMap;
    });
    return map;
}

function computeDifferences(ours, theirs, order = [], labels = {}) {
    const seen = new Set();
    const orderedKeys = [];

    order.forEach((key) => {
        const normalized = key.toLowerCase();
        if (!seen.has(normalized)) {
            orderedKeys.push(normalized);
            seen.add(normalized);
        }
    });

    [...Object.keys(ours), ...Object.keys(theirs)].forEach((key) => {
        const normalized = key.toLowerCase();
        if (!seen.has(normalized)) {
            orderedKeys.push(normalized);
            seen.add(normalized);
        }
    });

    const fromOrder = orderedKeys.slice(0, order.length);
    const remaining = orderedKeys.slice(fromOrder.length).sort();
    const keys = [...fromOrder, ...remaining];

    const rows = [];

    keys.forEach((name) => {
        const row = {
            name: labels[name] || name,
            hue: [],
            saturation: [],
            lightness: []
        };
        let hasData = false;
        SHADE_LABELS.forEach((label) => {
            const oursShade = ours[name]?.[label] || null;
            const theirsShade = theirs[name]?.[label] || null;
            if (!oursShade || !theirsShade) {
                row.hue.push(null);
                row.saturation.push(null);
                row.lightness.push(null);
                return;
            }
            const hueDelta = signedHueDifference(oursShade.hue, theirsShade.hue);
            const satDelta = theirsShade.saturation - oursShade.saturation;
            const lightDelta = theirsShade.lightness - oursShade.lightness;
            row.hue.push(hueDelta);
            row.saturation.push(satDelta);
            row.lightness.push(lightDelta);
            hasData = true;
        });
        if (hasData) {
            rows.push(row);
        }
    });

    return { rows };
}

function renderHtml({ rows }) {
    const title = "Tailwind Difference Heatmaps";
    const tableHue = renderTable("Hue Δ (°) (+/- 10° scale)", rows, "hue", 10);
    const tableSat = renderTable(
        "Saturation Δ (%) (+/- 15% scale)",
        rows,
        "saturation",
        15
    );
    const tableLight = renderTable(
        "Lightness Δ (%) (+/- 10% scale)",
        rows,
        "lightness",
        10
    );

    return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <style>
    :root {
      color-scheme: light;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    body {
      margin: 2rem;
      background: #f8fafc;
      color: #0f172a;
    }
    h1 {
      margin-bottom: 1rem;
    }
    section {
      margin-bottom: 2.5rem;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      max-width: 100%;
      overflow: hidden;
      border-radius: 12px;
      box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
      background: #fff;
      margin-top: 1rem;
    }
    th, td {
      border: 1px solid rgba(15, 23, 42, 0.08);
      padding: 0.4rem 0.6rem;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }
    thead th {
      background: #e2e8f0;
      font-weight: 600;
      position: sticky;
      top: 0;
    }
    tbody th {
      text-align: left;
      position: sticky;
      left: 0;
      background: #e2e8f0;
    }
    td[data-empty="true"] {
      color: rgba(15, 23, 42, 0.5);
      background: #f8fafc;
    }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p>Values show the signed difference between the Tailwind reference palette and your export (Tailwind minus yours). Negative values in red indicate your color is higher than Tailwind and needs to decrease; positive values in blue mean your value is lower and needs to increase. Color intensity clamps at +/-10° for hue, +/-15% for saturation, and +/-10% for lightness.</p>
  <section>
    ${tableHue}
  </section>
  <section>
    ${tableSat}
  </section>
  <section>
    ${tableLight}
  </section>
</body>
</html>`;
}

function renderTable(title, rows, channel, range) {
    if (!Array.isArray(rows) || !rows.length) {
        return `<h2>${title}</h2><p>No overlapping hues were found between your export and the Tailwind reference palette.</p>`;
    }
    const safeRange = range || 1;
    const headerCells = SHADE_LABELS.map(
        label => `<th scope="col">${label}</th>`
    ).join("");

    const body = rows
        .map((row) => {
            const cells = row[channel]
                .map((value) => {
                    if (value === null || !Number.isFinite(value)) {
                        return "<td data-empty=\"true\">—</td>";
                    }
                    const magnitude = Math.min(1, Math.abs(value) / safeRange);
                    const hue = value < 0 ? 0 : 210;
                    const saturation = magnitude === 0 ? 0 : 80;
                    const lightness = 100 - magnitude * 60;
                    const background = `hsl(${hue} ${saturation}% ${lightness}%)`;
                    const textColor = magnitude > 0.55 ? "#f8fafc" : "#0f172a";
                    const formatted = formatNumber(value);
                    return `<td style="background:${background};color:${textColor}" title="${formatted}">${formatted}</td>`;
                })
                .join("");
            return `<tr><th scope="row">${row.name}</th>${cells}</tr>`;
        })
        .join("");

    return `<h2>${title}</h2>
  <table>
    <thead>
      <tr>
        <th scope="col">Hue</th>
        ${headerCells}
      </tr>
    </thead>
    <tbody>
      ${body}
    </tbody>
  </table>`;
}

function signedHueDifference(ours, theirs) {
    const raw = theirs - ours;
    return ((raw + 540) % 360) - 180;
}

function hexToHsl(hex) {
    const cleaned = (hex || "").replace(/^#/, "");
    if (cleaned.length !== 6) {
        return { hue: 0, saturation: 0, lightness: 0 };
    }
    const r = parseInt(cleaned.slice(0, 2), 16) / 255;
    const g = parseInt(cleaned.slice(2, 4), 16) / 255;
    const b = parseInt(cleaned.slice(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    let hue = 0;
    if (delta !== 0) {
        switch (max) {
            case r:
                hue = ((g - b) / delta) % 6;
                break;
            case g:
                hue = (b - r) / delta + 2;
                break;
            case b:
                hue = (r - g) / delta + 4;
                break;
        }
        hue *= 60;
        if (hue < 0) {
            hue += 360;
        }
    }

    const lightness = (max + min) / 2;
    const saturation
        = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

    return {
        hue,
        saturation: saturation * 100,
        lightness: lightness * 100
    };
}

function formatNumber(value) {
    if (!Number.isFinite(value)) {
        return "—";
    }
    const fixed = value.toFixed(2);
    if (Number(fixed) === 0) {
        return "0.00";
    }
    return fixed;
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
