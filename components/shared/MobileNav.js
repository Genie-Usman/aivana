"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { navLinks } from "../../constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { motion } from "framer-motion";

const MobileNav = () => {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);

    const headerVariants = {
        hidden: { y: -20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, damping: 10 }
        }
    };

    return (
        <header className="fixed top-0 left-0 w-full h-16 bg-white/95 backdrop-blur-md border-b border-purple-50 px-4 shadow-sm z-50 lg:hidden">
            <motion.div
                initial="hidden"
                animate="visible"
                variants={headerVariants}
                className="flex justify-between items-center h-full max-w-screen-xl mx-auto"
            >
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Image
                            src="/assets/images/logo-text.png"
                            alt="Logo"
                            width={130}
                            height={20}
                        />
                    </motion.div>
                </Link>

                {/* Navigation */}
                <nav className="flex items-center gap-2">
                    <SignedIn>
                        <motion.div whileHover={{ scale: 1.05 }} className="mr-1">
                            <UserButton appearance={{
                                elements: {
                                    avatarBox: "w-9 h-9 border border-purple-100",
                                    userButtonPopoverCard: "shadow-lg rounded-xl"
                                }
                            }} />
                        </motion.div>

                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTrigger asChild>
                                <motion.button
                                    whileHover={{ backgroundColor: "#F5F3FF" }}
                                    whileTap={{ scale: 0.95 }}
                                    className="p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-100"
                                >
                                    <Image
                                        src='/assets/icons/menu.svg'
                                        alt="menu"
                                        height={24}
                                        width={24}
                                    />
                                </motion.button>
                            </SheetTrigger>

                            <SheetContent
                                side="right"
                                className="w-72 p-0 bg-white border-l border-purple-50 overflow-hidden"
                            >
                                <motion.div
                                    initial={{ x: "100%" }}
                                    animate={{ x: 0 }}
                                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                                    className="h-full flex flex-col"
                                >
                                    <SheetHeader className="px-6 py-5 bg-white">
                                        <SheetTitle className="text-white font-bold text-lg hidden">Menu</SheetTitle>
                                        <Image
                                            src="/assets/images/logo-text.png"
                                            alt="Logo"
                                            width={130}
                                            height={20}
                                        />
                                    </SheetHeader>

                                    <ul className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                                        {navLinks.map((link, i) => {
                                            const isActive = link.route === pathname;
                                            return (
                                                <motion.li
                                                    key={link.route}
                                                    initial={{ x: 10, opacity: 0 }}
                                                    animate={{ x: 0, opacity: 1 }}
                                                    transition={{ delay: i * 0.05 }}
                                                >
                                                    <Link
                                                        href={link.route}
                                                        onClick={() => setOpen(false)}
                                                        className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${isActive
                                                            ? "text-[#624CF5] shadow-sm border border-purple-100"
                                                            : "text-gray-700 hover:bg-purple-50/50 hover:text-[#624CF5]"
                                                            }`}
                                                    >
                                                        <motion.div
                                                            whileHover={{ scale: 1.1 }}
                                                            className={`p-2 rounded-lg ${isActive
                                                                ? " text-white"
                                                                : "bg-purple-100 text-[#624CF5]"
                                                                }`}
                                                        >
                                                            <Image
                                                                src={link.icon}
                                                                alt="icon"
                                                                width={20}
                                                                height={20}
                                                            />
                                                        </motion.div>
                                                        <span className="text-sm">{link.label}</span>
                                                    </Link>
                                                </motion.li>
                                            );
                                        })}
                                    </ul>
                                </motion.div>
                            </SheetContent>
                        </Sheet>
                    </SignedIn>

                    <SignedOut>
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button
                                asChild
                                className="py-2.5 px-5 rounded-xl font-semibold text-sm bg-[url('/assets/images/gradient-bg.svg')] text-white shadow-sm"
                            >
                                <Link href="/sign-up">Login</Link>
                            </Button>
                        </motion.div>
                    </SignedOut>
                </nav>
            </motion.div>
        </header>
    );
};

export default MobileNav;
