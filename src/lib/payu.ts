import crypto from 'crypto';
import { readPersistentDataAsync } from '@/lib/persistentStore';
import { SiteSettings } from '@/app/api/settings/route';

export interface PayUConfig {
  enabled: boolean;
  mode: 'test' | 'prod';
  merchantKey: string;
  merchantSalt: string;
  paymentUrl: string;
}

export const DEFAULT_PAYU_TEST_CONFIG: PayUConfig = {
  enabled: true,
  mode: 'test',
  merchantKey: process.env.PAYU_MERCHANT_KEY || 'gtKFFx',
  merchantSalt: process.env.PAYU_MERCHANT_SALT || 'eCwWELxi',
  paymentUrl: process.env.PAYU_PAYMENT_URL || 'https://test.payu.in/_payment',
};

export const PAYU_PROD_URL = 'https://secure.payu.in/_payment';
export const PAYU_TEST_URL = 'https://test.payu.in/_payment';

/**
 * Retrieves the current PayU settings:
 * Checks persistent store (set by admin in Admin Panel) first,
 * then falls back to environment variables, then official test sandbox credentials.
 */
export async function getPayUSettings(): Promise<PayUConfig> {
  try {
    const siteSettings = await readPersistentDataAsync<SiteSettings | null>('site_settings', null);
    if (siteSettings && (siteSettings as any).payuSettings) {
      const p = (siteSettings as any).payuSettings;
      const mode = p.mode === 'prod' ? 'prod' : 'test';
      const defaultUrl = mode === 'prod' ? PAYU_PROD_URL : PAYU_TEST_URL;
      return {
        enabled: p.enabled !== false,
        mode,
        merchantKey: p.merchantKey?.trim() || (mode === 'prod' ? process.env.PAYU_MERCHANT_KEY || '' : DEFAULT_PAYU_TEST_CONFIG.merchantKey),
        merchantSalt: p.merchantSalt?.trim() || (mode === 'prod' ? process.env.PAYU_MERCHANT_SALT || '' : DEFAULT_PAYU_TEST_CONFIG.merchantSalt),
        paymentUrl: p.paymentUrl?.trim() || defaultUrl,
      };
    }
  } catch (err) {
    console.warn('Could not read persistent PayU settings, using defaults/env:', err);
  }

  const envMode = (process.env.PAYU_ENV === 'prod' || process.env.PAYU_ENV === 'production') ? 'prod' : 'test';
  return {
    enabled: process.env.PAYU_ENABLED !== 'false',
    mode: envMode,
    merchantKey: process.env.PAYU_MERCHANT_KEY || DEFAULT_PAYU_TEST_CONFIG.merchantKey,
    merchantSalt: process.env.PAYU_MERCHANT_SALT || DEFAULT_PAYU_TEST_CONFIG.merchantSalt,
    paymentUrl: process.env.PAYU_PAYMENT_URL || (envMode === 'prod' ? PAYU_PROD_URL : PAYU_TEST_URL),
  };
}

export interface PayUHashParams {
  key: string;
  txnid: string;
  amount: string | number;
  productinfo: string;
  firstname: string;
  email: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  salt: string;
}

/**
 * PayU Request Hash Generation Formula:
 * sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT)
 */
export function generatePayUHash(params: PayUHashParams): string {
  const formattedAmount = Number(params.amount).toFixed(2);
  const hashString = [
    params.key.trim(),
    params.txnid.trim(),
    formattedAmount,
    params.productinfo.trim(),
    params.firstname.trim(),
    params.email.trim(),
    (params.udf1 || '').trim(),
    (params.udf2 || '').trim(),
    (params.udf3 || '').trim(),
    (params.udf4 || '').trim(),
    (params.udf5 || '').trim(),
    '', // udf6
    '', // udf7
    '', // udf8
    '', // udf9
    '', // udf10
    params.salt.trim(),
  ].join('|');

  return crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();
}

export interface PayUResponseParams {
  key?: string;
  txnid?: string;
  amount?: string | number;
  productinfo?: string;
  firstname?: string;
  email?: string;
  status?: string;
  hash?: string;
  udf1?: string;
  udf2?: string;
  udf3?: string;
  udf4?: string;
  udf5?: string;
  additionalCharges?: string | number;
}

/**
 * PayU Response Hash Verification Formula:
 * If additionalCharges is present:
 *   sha512(additionalCharges|SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 * Else:
 *   sha512(SALT|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key)
 */
export function verifyPayUResponseHash(params: PayUResponseParams, salt: string): boolean {
  if (!params.hash) return false;

  const formattedAmount = Number(params.amount || 0).toFixed(2);
  const status = (params.status || '').trim();

  let hashSequence = [
    salt.trim(),
    status,
    '', // udf10
    '', // udf9
    '', // udf8
    '', // udf7
    '', // udf6
    (params.udf5 || '').trim(),
    (params.udf4 || '').trim(),
    (params.udf3 || '').trim(),
    (params.udf2 || '').trim(),
    (params.udf1 || '').trim(),
    (params.email || '').trim(),
    (params.firstname || '').trim(),
    (params.productinfo || '').trim(),
    formattedAmount,
    (params.txnid || '').trim(),
    (params.key || '').trim(),
  ];

  if (params.additionalCharges) {
    const formattedAddl = Number(params.additionalCharges).toFixed(2);
    hashSequence = [formattedAddl, ...hashSequence];
  }

  const hashString = hashSequence.join('|');
  const calculatedHash = crypto.createHash('sha512').update(hashString).digest('hex').toLowerCase();

  return calculatedHash === params.hash.toLowerCase();
}
