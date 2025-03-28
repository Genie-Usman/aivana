"use client";

import { loadStripe } from "@stripe/stripe-js";
import { useEffect } from "react";

import { toast } from "sonner";
import { checkoutCredits } from "../../lib/actions/Transaction.actions";

import { Button } from "../ui/button";

const Checkout = ({ plan, amount, credits, buyerId }) => {
    useEffect(() => {
        // Load Stripe.js only once
        const initializeStripe = async () => {
            await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
        };
        initializeStripe();
    }, []);

    useEffect(() => {
        // Check to see if this is a redirect back from Checkout
        if (typeof window !== 'undefined') {
            const query = new URLSearchParams(window.location.search);
            if (query.get("success")) {
                toast.success("Order placed!", {
                    description: "You will receive an email confirmation",
                    duration: 5000,
                    className: "bg-green-100 text-green-900",
                });
            }

            if (query.get("canceled")) {
                toast.error("Order canceled!", {
                    description: "Continue to shop around and checkout when you're ready",
                    duration: 5000,
                    className: "bg-red-100 text-red-900",
                });
            }
        }
    }, []);

    const onCheckout = async (e) => {
        e.preventDefault(); // Prevent default form submission
        
        const transaction = {
            plan,
            amount,
            credits,
            buyerId,
        };

        try {
            await checkoutCredits(transaction);
        } catch (error) {
            toast.error("Checkout failed", {
                description: error.message || "Please try again later",
                duration: 5000,
                className: "bg-red-100 text-red-900",
            });
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