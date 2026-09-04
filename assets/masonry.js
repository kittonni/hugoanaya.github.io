(function () {
  const TARGET_LONG_EDGE = 700;
  const grid = document.getElementById('gallery');

  function getColumnCount() {
    return getComputedStyle(grid).gridTemplateColumns.split(' ').length;
  }

  function layout() {
    const cols = getColumnCount();
    const gapPx = parseFloat(getComputedStyle(grid).columnGap) || 16;
    const rowUnit = parseFloat(getComputedStyle(grid).gridAutoRows) || 8;
    const gridWidth = grid.getBoundingClientRect().width;
    const colWidth = (gridWidth - gapPx * (cols - 1)) / cols;
    const maxColSpan = Math.min(cols, 3);

    grid.querySelectorAll('.auto-size').forEach(item => {
      const img = item.querySelector('img');
      if (!img || !img.naturalWidth) return;

      const ratio = img.naturalWidth / img.naturalHeight;
      let colSpan, rowSpan;

      if (ratio > 1.05) {
        colSpan = Math.round((TARGET_LONG_EDGE + gapPx) / (colWidth + gapPx));
        colSpan = maxColSpan >= 2
          ? Math.max(2, Math.min(maxColSpan, colSpan))
          : 1;

        const renderedWidth = colSpan * colWidth + (colSpan - 1) * gapPx;
        const renderedHeight = renderedWidth / ratio;
        rowSpan = Math.max(1, Math.round((renderedHeight + gapPx) / (rowUnit + gapPx)));

      } else if (ratio < 0.95) {
        colSpan = Math.min(2, maxColSpan);
        const renderedWidth = colSpan * colWidth + (colSpan - 1) * gapPx;
        const renderedHeight = renderedWidth / ratio;
        rowSpan = Math.max(1, Math.round((renderedHeight + gapPx) / (rowUnit + gapPx)));

      } else {
        colSpan = 1;
        rowSpan = Math.max(1, Math.round((colWidth + gapPx) / (rowUnit + gapPx)));
      }

      item.style.gridColumn = `span ${colSpan}`;
      item.style.gridRow = `span ${rowSpan}`;
    });
  }

  function whenImagesReady(callback) {
    const imgs = Array.from(grid.querySelectorAll('img'));
    let remaining = imgs.length;
    if (remaining === 0) return callback();
    imgs.forEach(img => {
      if (img.complete && img.naturalWidth) {
        if (--remaining === 0) callback();
      } else {
        img.addEventListener('load', () => { if (--remaining === 0) callback(); });
        img.addEventListener('error', () => { if (--remaining === 0) callback(); });
      }
    });
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 150);
  });

  whenImagesReady(layout);
})();