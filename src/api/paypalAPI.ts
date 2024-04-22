import axios from 'axios';
import http from 'http';
import https from 'https';
import { IPaypalInvoiceData, IPaypalItems } from '@/types';

const CLIENTID = process.env.PAYPAL_CLIENT_ID!;
const SECRET = process.env.PAYPAL_SECRET!;
const PAYPAL_BASIC_AUTH = process.env.PAYPAL_BASIC_AUTH!;

const instance = axios.create({
    httpAgent: new http.Agent({ keepAlive: true }),
    httpsAgent: new https.Agent({ keepAlive: true }),
    headers: {
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
    },
});

export const generateToken = async () => {
    const requestData = new URLSearchParams();
    requestData.append('grant_type', 'client_credentials');

    try {
        const paypalOAuthRes = await instance.post(
            'https://api-m.sandbox.paypal.com/v1/oauth2/token',
            requestData.toString(),
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    Authorization:
                        // eslint-disable-next-line max-len
                        `Basic ${PAYPAL_BASIC_AUTH}`,
                },
            }
        );
        return paypalOAuthRes.data.access_token;
    } catch (error) {
        throw error;
    }
};

export const generateInvoiceNumber = async () => {
    try {
        const token = await generateToken();
        const response = await instance.post(
            'https://api-m.sandbox.paypal.com/v2/invoicing/generate-next-invoice-number',
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            status: response.status,
            data: response.data.invoice_number,
        };
    } catch (error: any) {
        return {
            status: error.response.status,
            data: error.response.data,
        };
    }
};

export const generateDraftInvoice = async ({
    amount,
    configuration,
    detail,
    invoicer,
    items,
    primary_recipients,
}: IPaypalInvoiceData) => {
    const data = {
        detail,
        invoicer,
        primary_recipients,
        items,
        configuration,
        amount,
    };

    try {
        const token = await generateToken();
        const response = await instance.post(
            'https://api-m.sandbox.paypal.com/v2/invoicing/invoices',
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            status: response.status,
            data: response.data,
        };
    } catch (error: any) {
        return {
            status: error.response.status,
            data: error.response.data,
        };
    }
};

export const sendInvoice = async (invoiceId: string) => {
    const data = {
        sendToRecipient: true,
        sendToInvoicer: false,
        id: invoiceId,
        invoice: {
            merchant: {},
        },
        userAcceptsTidVerification: false,
    };
    try {
        const token = await generateToken();
        const response = await instance.post(
            `https://api-m.sandbox.paypal.com/v2/invoicing/invoices/${invoiceId}/send`,
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            status: response.status,
            data: response.data,
        };
    } catch (error: any) {
        return {
            status: error.response.status,
            data: error.response.data,
        };
    }
};

export const createOrder = async ({
    cancel_url,
    currency_code,
    discount = 0,
    items,
    return_url,
    shipping_discount = 0,
}: {
    currency_code: string;
    items: IPaypalItems[];
    return_url: string;
    discount: number;
    cancel_url: string;
    shipping_discount?: number;
}) => {
    let totalAmount = 0;
    let discountAmount = 0;
    let shippingDiscount = 0;
    const mappedItems = items.map((item: any) => {
        totalAmount += item.quantity * item.value;
        return {
            name: item.name,
            description: item.description,
            quantity: item.quantity,
            unit_amount: {
                currency_code,
                value: item.value,
            },
        };
    });
    if (discount) {
        discountAmount = (totalAmount * discount) / 100;
    }
    if (shipping_discount) {
        shippingDiscount = (totalAmount * shipping_discount) / 100;
    }
    const data = JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
            {
                items: mappedItems,
                amount: {
                    currency_code,
                    value: totalAmount - discountAmount - shippingDiscount,
                    breakdown: {
                        item_total: {
                            currency_code,
                            value: totalAmount,
                        },
                        shipping_discount: {
                            currency_code,
                            value: shippingDiscount,
                        },
                        discount: {
                            currency_code,
                            value: discountAmount,
                        },
                    },
                },
            },
        ],
        application_context: {
            return_url,
            cancel_url,
        },
    });

    try {
        const token = await generateToken();
        const response = await instance.post(
            'https://api-m.sandbox.paypal.com/v2/checkout/orders',
            data,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        return {
            status: response.status,
            data: response.data.links.find(
                (link: { rel: string }) => link.rel === 'approve'
            ).href,
        };
    } catch (error: any) {
        return {
            status: error.response.status,
            data: error.response.data,
        };
    }
};
