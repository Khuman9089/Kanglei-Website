/**
 * UPI Payment Configuration
 * Manages UPI ID, QR code, and payment display settings
 */

export interface UPIConfig {
  upiId: string;
  holderName: string;
  qrImageUrl: string;
}

/**
 * Gets UPI configuration from environment variables.
 */
export function getUPIConfig(): UPIConfig {
  return {
    upiId: process.env.NEXT_PUBLIC_UPI_ID || 'astrologer@upi',
    holderName: process.env.NEXT_PUBLIC_UPI_HOLDER_NAME || 'KangleiAstro',
    qrImageUrl: process.env.NEXT_PUBLIC_UPI_QR_IMAGE || '/images/upi-qr.png',
  };
}

/**
 * Generates a UPI deep link for mobile payment.
 * Format: upi://pay?pa={upiId}&pn={name}&am={amount}&cu=INR&tn={note}
 */
export function generateUPIDeepLink(
  amount: number,
  transactionNote: string,
  config?: UPIConfig
): string {
  const upi = config || getUPIConfig();
  const params = new URLSearchParams({
    pa: upi.upiId,
    pn: upi.holderName,
    am: amount.toFixed(2),
    cu: 'INR',
    tn: transactionNote,
  });
  return `upi://pay?${params.toString()}`;
}

/**
 * Validates a UPI Transaction Reference (UTR) number.
 * UTR numbers are typically 12-digit alphanumeric strings.
 */
export function validateUTR(utr: string): boolean {
  // UTR can be 12-22 characters, alphanumeric
  const utrPattern = /^[A-Za-z0-9]{12,22}$/;
  return utrPattern.test(utr.trim());
}
