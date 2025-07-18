"use client";

import { navLinks } from "../../constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import CustomLink from "./CustomLink";

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: {
        opacity: 1,
        x: 0,
        transition: { type: "spring", stiffness: 100 },
    },
};

const MotionLink = ({ link, isActive }) => (
    <motion.li variants={itemVariants}>
        <CustomLink href={link.route}>
            <motion.div
                className={`flex items-center gap-4 px-4 py-3 rounded-3xl font-medium text-[16px] transition-colors duration-300 ${isActive
                        ? "bg-[url('/assets/images/gradient-bg.svg')] text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                whileHover={isActive ? {} : { opacity: 0.9 }}
                whileTap={{ scale: 0.98 }}
                style={{ willChange: "transform" }}
            >
                <Image
                    src={link.icon}
                    alt={`${link.label} icon`}
                    width={24}
                    height={24}
                    className={`transition-all ${isActive
                        ? "brightness-200"
                        : "opacity-70 group-hover:opacity-100"
                        }`}
                />
                <span className="relative block h-[20px] leading-none">
                    {link.label}
                    {isActive && (
                        <motion.span
                            layoutId="activeIndicator"
                            className="absolute -left-1 -right-1 -bottom-0 h-0.5 bg-white/50 rounded-full"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        />
                    )}
                </span>
            </motion.div>
        </CustomLink>
    </motion.li>
);

const Sidebar = () => {
    const pathname = usePathname();

    const renderNavLinks = (links) =>
        links.map((link) => {
            const isActive = link.route === pathname;
            return <MotionLink key={link.route} link={link} isActive={isActive} />;
        });

    return (
        <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="hidden custom-scrollbar overflow-y-auto fixed left-0 top-0 h-screen w-72 bg-white p-6 shadow-xl shadow-[#F4F7FE] lg:flex flex-col justify-between"
        >
            {/* Logo & Navigation */}
            <div className="flex flex-col gap-6">
                {/* Logo */}
                <div>
                    <Link href="/" aria-label="Home">
                        <Image
                            src="/assets/images/logo-text.png"
                            alt="Aivana Logo"
                            width={180}
                            height={28}
                            className="transition-all hover:opacity-90"
                            priority
                        />
                    </Link>
                </div>

                {/* Nav Links */}
                <SignedIn>
                    <motion.nav
                        className="flex flex-col gap-3"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                    >
                        <ul className="flex flex-col gap-3">{renderNavLinks(navLinks.slice(0, 6))}</ul>

                        <motion.hr
                            className="border-t border-gray-200 my-2"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.4 }}
                        />

                        <ul className="flex flex-col gap-3">{renderNavLinks(navLinks.slice(6))}</ul>
                    </motion.nav>
                </SignedIn>
            </div>

            {/* Footer: User Button / Login */}
            <div className="mt-auto flex flex-col gap-4">
                <SignedIn>
                    <motion.div
                        className="p-4 flex items-center justify-start rounded-full hover:bg-gray-50 transition-all cursor-pointer"
                        whileHover={{ x: -5 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <UserButton
                            showName
                            appearance={{
                                elements: {
                                    userButtonBox: "flex-row-reverse gap-3",
                                    userButtonOuterIdentifier: "font-medium text-gray-800",
                                    avatarBox: "w-8 h-8",
                                },
                            }}
                        />
                    </motion.div>
                </SignedIn>

                <SignedOut>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                            asChild
                            className="w-full py-3 px-6 rounded-lg font-medium text-[16px] focus-visible:ring-0 bg-[url('/assets/images/gradient-bg.svg')] text-white shadow-lg hover:shadow-xl transition-all"
                        >
                            <Link href="/sign-up">Login</Link>
                        </Button>
                    </motion.div>
                </SignedOut>
            </div>
        </motion.aside>
    );
};

export default Sidebar;