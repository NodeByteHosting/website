import React, { useEffect, useState } from "react";
import { useSpring, animated } from "@react-spring/web";

interface AnimatedPriceProps {
    basePrice: string;
}

const currencies = [
    { symbol: "$", code: "USD" },
    { symbol: "€", code: "EUR" },
    { symbol: "£", code: "GBP" },
    { symbol: "¥", code: "JPY" },
    { symbol: "₹", code: "INR" },
    { symbol: "$", code: "CAD" },
    { symbol: "$", code: "AUD" },
    { symbol: "$", code: "NZD" },
    { symbol: "¥", code: "CNY" },
];

const API_URL = `https://api.exchangerate-api.com/v4/latest/USD`;

const AnimatedPrice: React.FC<AnimatedPriceProps> = ({ basePrice }) => {
    const [index, setIndex] = useState(0);
    const numericBasePrice = parseFloat(basePrice.replace(/[^0-9.-]+/g, ""));
    const [price, setPrice] = useState(numericBasePrice);
    const [exchangeRates, setExchangeRates] = useState<{ [key: string]: number }>({});

    // Fetch exchange rates
    useEffect(() => {
        fetch(API_URL)
            .then((res) => res.json())
            .then((data) => {
                if (data.rates) {
                    setExchangeRates(data.rates);
                }
            })
            .catch((err) => console.error("Error fetching exchange rates:", err));
    }, []);

    // Handle currency switching
    useEffect(() => {
        if (!exchangeRates.USD) return;

        const interval = setInterval(() => {
            setIndex((prevIndex) => (prevIndex + 1) % currencies.length);
            const nextCurrency = currencies[(index + 1) % currencies.length].code;
            const rate = exchangeRates[nextCurrency] || 1;
            setPrice(parseFloat((numericBasePrice * rate).toFixed(2)));
        }, 3000);

        return () => clearInterval(interval);
    }, [numericBasePrice, index, exchangeRates]);

    const { number } = useSpring({
        from: { number: 0 },
        number: price,
        delay: 200,
        config: { mass: 1, tension: 170, friction: 26 },
    });

    return (
        <div className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-blue to-green">
            <span className="mr-0">{currencies[index].symbol}</span>
            <animated.span>{number.to((n) => n.toFixed(2))}</animated.span>
            <span className="ml-1 text-xl font-bold">{currencies[index].code}</span>
        </div>
    );
};

export default AnimatedPrice;