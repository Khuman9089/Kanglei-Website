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

  // Find all individual printable section blocks marked with 'pdf-card' or 'a4-page-sheet'
  const cards = targetElement.querySelectorAll('.pdf-card, .a4-page-sheet');
  
  if (cards.length === 0) {
    console.error('No printable cards found for capture');
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

  for (let index = 0; index < totalCards; index++) {
    const progressPercent = Math.round(((index + 1) / totalCards) * 95);
    if (onProgress) {
      onProgress(progressPercent, `Processing section ${index + 1} of ${totalCards}...`);
    }

    const cardEl = cards[index] as HTMLElement;

    // Create an off-screen container for crisp card capture
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '-9999px';
    container.style.width = '794px'; // ~210mm in px at 96 DPI
    container.style.backgroundColor = '#ffffff';
    container.style.color = '#0f172a';
    container.style.boxSizing = 'border-box';
    container.style.padding = '16px';
    container.style.zIndex = '-9999';

    const clonedCard = cardEl.cloneNode(true) as HTMLElement;
    clonedCard.style.width = '100%';
    clonedCard.style.margin = '0';

    container.appendChild(clonedCard);
    document.body.appendChild(container);

    try {
      const canvas = await html2canvas(clonedCard, {
        scale: 1.3,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: 794,
        onclone: (clonedDoc) => {
          // Sanitize CSS text in all <style> tags to eliminate lab() / oklab() / oklch() / lch()
          const styleTags = clonedDoc.querySelectorAll('style');
          styleTags.forEach((styleTag) => {
            if (styleTag.textContent) {
              styleTag.textContent = styleTag.textContent
                .replace(/lab\([^)]+\)/gi, 'rgb(15, 23, 42)')
                .replace(/oklab\([^)]+\)/gi, 'rgb(15, 23, 42)')
                .replace(/oklch\([^)]+\)/gi, 'rgb(15, 23, 42)')
                .replace(/lch\([^)]+\)/gi, 'rgb(15, 23, 42)');
            }
          });

          const allElements = clonedDoc.getElementsByTagName('*');
          for (let i = 0; i < allElements.length; i++) {
            const el = allElements[i] as HTMLElement;
            if (!el || !el.style) continue;

            try {
              const compStyle = clonedDoc.defaultView?.getComputedStyle(el);
              if (compStyle) {
                const checkAndSanitize = (propName: string, fallbackVal: string) => {
                  const val = compStyle[propName as any];
                  if (val && (val.includes('lab(') || val.includes('okl'))) {
                    el.style.setProperty(propName, fallbackVal);
                  }
                };

                checkAndSanitize('color', '#0f172a');
                checkAndSanitize('background-color', '#ffffff');
                checkAndSanitize('border-color', '#e2e8f0');
                checkAndSanitize('outline-color', '#e2e8f0');
                checkAndSanitize('fill', '#0f172a');
                checkAndSanitize('stroke', '#0f172a');
                checkAndSanitize('stop-color', '#0f172a');

                if (compStyle.boxShadow && (compStyle.boxShadow.includes('lab(') || compStyle.boxShadow.includes('okl'))) {
                  el.style.boxShadow = 'none';
                }
              }
            } catch (e) {}
          }
        },
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.92);
      const cardImgHeight = (canvas.height * contentWidth) / canvas.width;

      // Check if card fits on current page; if not, add a new page
      if (!isFirstPage && currentY + cardImgHeight > pdfHeight - pageMargin) {
        pdf.addPage();
        currentY = pageMargin;
      }

      pdf.addImage(imgData, 'JPEG', pageMargin, currentY, contentWidth, cardImgHeight, undefined, 'FAST');
      currentY += cardImgHeight + 4; // 4mm spacing between cards
      isFirstPage = false;
    } catch (err) {
      console.error(`Error rendering card ${index + 1}:`, err);
    } finally {
      document.body.removeChild(container);
    }
  }

  if (onProgress) {
    onProgress(100, 'Download Starting...');
  }

  pdf.save(filename);
}
