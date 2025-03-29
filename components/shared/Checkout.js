"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";
import { Toaster } from "./Toasts";
import { checkoutCredits } from "../../lib/actions/Transaction.actions";
import { Button } from "../ui/button";

const Checkout = ({ plan, amount, credits, buyerId }) => {
    useEffect(() => {
        const initializeStripe = async () => {
            await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        };
        initializeStripe();
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const query = new URLSearchParams(window.location.search);
            if (query.get("success")) {
                Toaster.success(
                    "Order placed!",
                    "You will receive an email confirmation"
                );

            }

            if (query.get("canceled")) {
                Toaster.error(
                    "Order canceled!",
                    "Continue to shop around and checkout when you're ready"
                );
            }
        }
    }, []);

    const onCheckout = async (e) => {
        e.preventDefault();

        const transaction = {
            plan,
            amount,
            credits,
            buyerId,
        };

        try {
            await checkoutCredits(transaction);
        } catch (error) {
            Toaster.error(
                "Checkout failed",
                "Please try again later"
            );
        }
    };

    return (
        <form onSubmit={onCheckout}>
            <section>
                <Button
                    type="submit"
                    role="link"
                    className="w-full rounded-full bg-[url('/assets/images/gradient-bg.svg')] bg-cover"
                >
                    Buy Credit
                </Button>
            </section>
        </form>
    );
};

export default Checkout;