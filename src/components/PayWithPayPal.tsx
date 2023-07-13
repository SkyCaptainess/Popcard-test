import React from "react";

export default function PayWithPayPal() {
    const [paid, setPaid] = React.useState(false);
    const [error, setError] = React.useState(null);
    const paypalRef = React.useRef<HTMLDivElement>(null);


    // To show PayPal buttons once the component loads
    React.useEffect(() => {
        window.paypal
            .Buttons({
                commit: true,
                style: {
                    label: "pay",
                    layout: "horizontal",
                    tagline: "false",
                    shape: "pill"
                },
                createOrder: (data: any, actions: any) => {
                    return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                            {
                                description: "New student registration",
                                amount: {
                                    currency_code: "USD",
                                    value: 500.0
                                }
                            }
                        ]
                    });
                },
                onApprove: async (data: any, actions: any) => {
                    const order = await actions.order.capture();
                    setPaid(true);
                    console.log(order);
                },
                onError: (err: any) => {
                    //   setError(err),
                    console.error(err);
                }
            })
            .render(paypalRef.current);
    }, []);

    // If the payment has been made
    if (paid) {
        return <div>Payment successful.!</div>;
    }

    // If any error occurs
    if (error) {
        return <div>Error Occurred in processing payment.! Please try again.</div>;
    }

    // Default Render
    return (
        <div>
            <h4>Total Amount in Rs. : 500 /-</h4>
            <div ref={paypalRef} />
        </div>
    );
}
