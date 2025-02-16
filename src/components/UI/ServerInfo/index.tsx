import React from "react";
import Marquee from "react-fast-marquee";
import { Modal, ModalContent } from "@nextui-org/react";
import { ButtonGradient } from "ui/Button/ButtonGradient";
import { ServerInfoModalProps } from "types/services";

const ServerInfoModal: React.FC<ServerInfoModalProps> = ({
    isOpen,
    onClose,
    title,
    features,
    faqs,
    marqueeItems
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            backdrop="blur"
            classNames={{
                backdrop: "bg-black/50 backdrop-blur-lg",
                base: "border-slate-700 bg-gradient-to-b from-slate-900 to-slate-800",
                header: "border-b-[1px] border-slate-700",
                footer: "border-t-[1px] border-slate-700",
                closeButton: "hover:bg-white/5 active:bg-white/10",
            }}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <div className="p-6">
                            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue to-green">
                                {title}
                            </h2>

                            <div className="mt-6">
                                <h3 className="text-xl font-semibold text-white mb-4">Features</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {features.map((item, i) => (
                                        <li key={i} className="flex items-center space-x-3">
                                            <div className="text-green">{item.icon}</div>
                                            {item.link ? (
                                                <a href={item.link} className="text-white/75 underline">
                                                    {item.text}
                                                </a>
                                            ) : (
                                                <p className="text-white/75">{item.text}</p>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <section className="mt-8">
                                <h4 className="text-white">Available server types:</h4>
                                <Marquee autoFill speed={20} pauseOnHover direction="left">
                                    <div className="flex space-x-4">
                                        {marqueeItems.map((item, i) => (
                                            <div key={i} className="opacity-70">
                                                <p className="text-transparent bg-clip-text bg-gradient-to-br from-blue to-green">{item.title}</p>
                                            </div>
                                        ))}
                                    </div>
                                </Marquee>
                            </section>

                            <div className="mt-8 flex justify-end">
                                <ButtonGradient
                                    radius="lg"
                                    size="lg"
                                    value="Close"
                                    onClick={onClose}
                                />
                            </div>
                        </div>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
};

export default ServerInfoModal;