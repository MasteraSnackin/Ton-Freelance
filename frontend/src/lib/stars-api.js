import { TonConnect } from '@tonconnect/sdk';

export async function purchaseStars(amount) {
    const connector = new TonConnect();
    return connector.sendTransaction({
        messages: [
            {
                address: 'TELEGRAM_STARS_CONTRACT',
                amount: amount * 1000000, // in nanoStars
            }
        ],
    });
}
