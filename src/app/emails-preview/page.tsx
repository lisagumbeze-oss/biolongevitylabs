import React from 'react';
import GuestOrderConfirmationEmail from '@/components/emails/GuestOrderConfirmationEmail';
import OrderCancellationEmail from '@/components/emails/OrderCancellationEmail';
import PaymentReceivedEmail1 from '@/components/emails/PaymentReceivedEmail1';
import PaymentReceivedEmail2 from '@/components/emails/PaymentReceivedEmail2';

export default function EmailsPreview() {
    return (
        <div className="bg-slate-900 p-8 flex flex-col gap-12">
            <h1 className="text-white text-3xl font-bold mb-8">Email Templates Preview</h1>

            <div>
                <h2 className="text-white text-xl mb-4 font-semibold">1. Guest Order Confirmation</h2>
                <div className="border-4 border-slate-700 rounded-2xl overflow-hidden scale-90 origin-top h-[800px] overflow-y-auto">
                    <GuestOrderConfirmationEmail />
                </div>
            </div>

            <div>
                <h2 className="text-white text-xl mb-4 font-semibold">2. Order Cancellation</h2>
                <div className="border-4 border-slate-700 rounded-2xl overflow-hidden scale-90 origin-top h-[800px] overflow-y-auto">
                    <OrderCancellationEmail orderId="ORD-PREVIEW-1234" />
                </div>
            </div>

            <div>
                <h2 className="text-white text-xl mb-4 font-semibold">3. Payment Received - Success</h2>
                <div className="border-4 border-slate-700 rounded-2xl overflow-hidden scale-90 origin-top h-[800px] overflow-y-auto">
                    <PaymentReceivedEmail1 orderId="ORD-PREVIEW-1234" />
                </div>
            </div>

            <div>
                <h2 className="text-white text-xl mb-4 font-semibold">4. Payment Received - Pending Reminder</h2>
                <div className="border-4 border-slate-700 rounded-2xl overflow-hidden scale-90 origin-top h-[800px] overflow-y-auto">
                    <PaymentReceivedEmail2 />
                </div>
            </div>

        </div>
    );
}
