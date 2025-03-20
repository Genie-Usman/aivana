"use client";

import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Button } from "../ui/button";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden overflow-y-auto fixed left-0 top-0 h-screen w-72 bg-white p-6 shadow-md shadow-[#BCB6FF]/50 lg:flex flex-col justify-between">
            {/* Logo */}
            <div className="flex flex-col gap-6">
                <Link href="/" className="flex items-center gap-2">
                    <Image src="/assets/images/logo-text.png" alt="Logo" width={180} height={28} />
                </Link>

                {/* Navigation Links */}
                <SignedIn>
                    <nav className="flex flex-col gap-3">
                        {/* First Section: Top 6 Links */}
                        <ul className="flex flex-col gap-2">
                            {navLinks.slice(0, 6).map((link) => {
                                const isActive = link.route === pathname;

                                return (
                                    <li key={link.route}>
                                        <Link
                                            href={link.route}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-3xl font-semibold text-[16px] transition-all ${
                                                isActive
                                                    ? "bg-gradient-to-r from-[#887ae1] to-[#6a5acd] text-white shadow-md"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            <Image
                                                src={link.icon}
                                                alt="icon"
                                                width={24}
                                                height={24}
                                                className={`${isActive ? "brightness-200" : "opacity-80"}`}
                                            />
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Second Section: Remaining Links */}
                        <ul className="flex flex-col gap-2 mt-4">
                            {navLinks.slice(6).map((link) => {
                                const isActive = link.route === pathname;

                                return (
                                    <li key={link.route}>
                                        <Link
                                            href={link.route}
                                            className={`flex items-center gap-4 px-4 py-3 rounded-3xl font-semibold text-[16px] transition-all ${
                                                isActive
                                                    ? "bg-gradient-to-r from-[#887ae1] to-[#6a5acd] text-white shadow-md"
                                                    : "text-gray-700 hover:bg-gray-100"
                                            }`}
                                        >
                                            <Image
                                                src={link.icon}
                                                alt="icon"
                                                width={24}
                                                height={24}
                                                className={`${isActive ? "brightness-200" : "opacity-80"}`}
                                            />
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>
                </SignedIn>
            </div>

            {/* User Profile & Login Button */}
            <div className="mt-auto flex flex-col gap-4">
                <SignedIn>
                    <div className="p-4 flex items-center justify-end rounded-lg hover:bg-gray-100 transition-all cursor-pointer">
                        <UserButton showName />
                    </div>
                </SignedIn>

                <SignedOut>
                    <Button
                        asChild
                        className="w-full flex items-center justify-center py-3 px-6 rounded-lg font-semibold text-[16px] focus-visible:ring-0 bg-gradient-to-r from-[#887ae1] to-[#6a5acd] text-white transition-all hover:opacity-90"
                    >
                        <Link href="/sign-up">Login</Link>
                    </Button>
                </SignedOut>
            </div>
        </aside>
    );
};

export default Sidebar;
