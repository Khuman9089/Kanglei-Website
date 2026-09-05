'use client';

import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export async function generateDirectPDFDownload(
  elementId: string,
  filename: string,
  onProgress?: (percent: number, stepText: string) => void
) {
  const targetElement = document.getElementById(elementId);
  if (!targetElement) {
    console.error('Target element not found for PDF download:', elementId);
    return;
  }

  // 1. PRIMARY FAST WASM VECTOR ENGINE (dompdf.js)
  // Runs in Web Worker off the main thread — prevents browser "Page Unresponsive" freezing
  try {
    if (onProgress) onProgress(20, 'Initializing high-speed WASM vector engine...');
    const { downloadPDF } = await import('dompdf.js');

    if (onProgress) onProgress(45, 'Generating vector A4 PDF in Web Worker (1-2s)...');
    await downloadPDF(
      targetElement,
      {
        format: 'a4',
        orientation: 'portrait',
        pagination: true,
        compress: true,
        useCORS: true,
        onProgress: (p) => {
          if (onProgress && p.stage) {
            const pct =
              p.stage === 'collecting'
                ? 35
                : p.stage === 'countingPages'
                ? 60
                : p.stage === 'rendering'
                ? 85
                : 98;
            onProgress(pct, `Rendering vector pages (${p.stage})...`);
          }
        },
      },
      filename
    );

    if (onProgress) onProgress(100, 'Download complete!');
    return;
  } catch (wasmErr) {
    console.warn('WASM dompdf.js encountered an issue, running non-blocking canvas engine fallback:', wasmErr);
  }

  // 2. RESILIENT FALLBACK: Non-blocking Chunked Canvas Engine
  // Yields to the browser event loop with setTimeout to guarantee the UI thread stays responsive
  const cards = targetElement.querySelectorAll('.pdf-card, .a4-page-sheet');
  
  if (cards.length === 0) {
    console.error('No printable cards found for capture');
    window.print();
    return;
  }

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth(); // ~210 mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // ~297 mm
  const pageMargin = 10; // 10mm padding on PDF pages
  const contentWidth = pdfWidth - pageMargin * 2;
  const contentHeight = pdfHeight - pageMargin * 2;

  let currentY = pageMargin;
  let isFirstPage = true;

  const totalCards = cards.length;
  const canvases: (HTMLCanvasElement | null)[] = new Array(totalCards).fill(null);
  const batchSize = 2;

  for (let b = 0; b < totalCards; b += batchSize) {
    // Yield to the browser event loop so the page stays completely responsive
    await new Promise((resolve) => setTimeout(resolve, 20));

    const batchIndices: number[] = [];
    for (let i = b; i < Math.min(b + batchSize, totalCards); i++) {
      batchIndices.push(i);
    }

    if (onProgress) {
      const progressPercent = Math.min(90, Math.round(((b + 1) / totalCards) * 90));
      onProgress(progressPercent, `Rendering section ${b + 1} of ${totalCards}...`);
    }

    await Promise.all(
      batchIndices.map(async (idx) => {
        const cardEl = cards[idx] as HTMLElement;
        try {
          canvases[idx] = await html2canvas(cardEl, {
            scale: 1.25,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 0,
            removeContainer: true,
          });
        } catch (err) {
          console.error(`Error rendering card ${idx + 1}:`, err);
        }
      })
    );
  }

  if (onProgress) {
    onProgress(92, 'Assembling multi-page A4 PDF...');
  }

  // Assemble the canvases into the PDF document with seamless multi-page slicing
  for (let index = 0; index < totalCards; index++) {
    const canvas = canvases[index];
    if (!canvas) continue;

    const cardImgWidth = canvas.width;
    const cardImgHeight = (canvas.height * contentWidth) / cardImgWidth;

    // Handle both fitting cards and extra-long cards that span multiple A4 pages seamlessly
    if (cardImgHeight <= contentHeight) {
      // Fits within a single page or remaining page height
      if (!isFirstPage && currentY + cardImgHeight > pdfHeight - pageMargin) {
        pdf.addPage();
        currentY = pageMargin;
      }

      const imgData = canvas.toDataURL('image/jpeg', 0.88);
      pdf.addImage(imgData, 'JPEG', pageMargin, currentY, contentWidth, cardImgHeight, undefined, 'FAST');
      currentY += cardImgHeight + 4; // 4mm spacing between cards
      isFirstPage = false;
    } else {
      // Section is longer than a single A4 page! Slice into consecutive A4 pages without cutting any text
      let remainingHeight = canvas.height;
      let sourceY = 0;
      const pagePixelHeight = (contentHeight * cardImgWidth) / contentWidth;

      while (remainingHeight > 0) {
        if (!isFirstPage) {
          pdf.addPage();
          currentY = pageMargin;
        }

        const slicePixelHeight = Math.min(remainingHeight, pagePixelHeight);

        // Create temporary slice canvas
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = cardImgWidth;
        sliceCanvas.height = slicePixelHeight;
        const ctx = sliceCanvas.getContext('2d');

        if (ctx) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, cardImgWidth, slicePixelHeight);
          ctx.drawImage(
            canvas,
            0, sourceY, cardImgWidth, slicePixelHeight,
            0, 0, cardImgWidth, slicePixelHeight
          );

          const sliceImgData = sliceCanvas.toDataURL('image/jpeg', 0.88);
          const sliceMmHeight = (slicePixelHeight * contentWidth) / cardImgWidth;

          pdf.addImage(sliceImgData, 'JPEG', pageMargin, currentY, contentWidth, sliceMmHeight, undefined, 'FAST');
          currentY += sliceMmHeight + 4;
        }

        sourceY += slicePixelHeight;
        remainingHeight -= slicePixelHeight;
        isFirstPage = false;
      }
    }
  }

  if (onProgress) {
    onProgress(100, 'Download Starting...');
  }

  pdf.save(filename);
}
