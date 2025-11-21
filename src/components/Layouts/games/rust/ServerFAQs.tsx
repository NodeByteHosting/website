import React from "react";
import { Accordion, AccordionItem } from "@nextui-org/react";

interface FAQItem {
    question: string;
    answer: string;
    icon?: React.ReactNode;
}

interface FAQProps {
    faqs: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ faqs }) => {
    const itemClasses = {
        base: "p-0",
        title: "text-white font-semibold text-sm md:font-medium md:text-md ml-4",
        content: "text-gray text-sm md:text-md",
    };

    return (
        <div className="faq-section mt-8">
            <h3 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h3>
            <Accordion
                fullWidth
                className="mt-4"
                itemClasses={itemClasses}
            >
                {faqs.map((faq, index) => (
                    <AccordionItem
                        key={index}
                        classNames={{
                            base: "bg-dark_gray hover:bg-black_secondary",
                        }}
                        className="text-white"
                        title={
                            <div className="flex items-center space-x-2">
                                {faq.icon && <div className="text-blue-400">{faq.icon}</div>}
                                <span>{faq.question}</span>
                            </div>
                        }
                    >
                        <p className="text-white/75">{faq.answer}</p>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
};

export default FAQ;