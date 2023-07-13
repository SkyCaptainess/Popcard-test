import React from 'react';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';

interface PaymentModalProps {
    amount: string;
    currency: string;
    onSuccess: (details: any) => void;
    onError: (error: any) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
    amount,
    currency,
    onSuccess,
    onError,
}) => {
    const [{ isResolved }] = usePayPalScriptReducer();

    const createOrder = (data: any, actions: any) => {
        return actions.order.create({
            purchase_units: [
                {
                    amount: {
                        value: amount,
                    },
                },
            ],
        });
    };

    const onApprove = (data: any, actions: any) => {
        return actions.order.capture().then(function (details: any) {
            onSuccess(details); // Handle the successful payment
        });
    };

    const onErrorHandler = (error: any) => {
        onError(error); // Handle payment error
    };

    return (
        <>
            {isResolved ? (
                <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onErrorHandler} />
            ) : (
                <div>Loading PayPal script...</div>
            )}
        </>
    );
};

export default PaymentModal;
