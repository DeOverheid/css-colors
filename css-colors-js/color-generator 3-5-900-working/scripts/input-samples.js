(function (root) {
  const SAMPLE_COUNT = 12;

  function initSamples(container) {
    const rows = container.querySelectorAll("[data-sample-row]");
    rows.forEach((row) => populateRow(row));
  }

  function populateRow(row) {
    row.textContent = "";
    row.style.setProperty("--color-output-columns", String(SAMPLE_COUNT));

    const fragment = document.createDocumentFragment();

    for (let index = 0; index < SAMPLE_COUNT; index += 1) {
      const swatch = document.createElement("div");
      swatch.className = "color-output__swatch";
      swatch.dataset.sampleIndex = String(index);
      fragment.appendChild(swatch);
    }

    row.appendChild(fragment);
  }

  root.ColorGenerator = root.ColorGenerator || {};
  root.ColorGenerator.initSamples = initSamples;
})(window);
