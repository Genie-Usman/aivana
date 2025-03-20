"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { SignedIn, UserButton } from "@clerk/nextjs";
import { navLinks } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const MobileNav = () => {
    const pathname = usePathname();

    return (
        <header className="flex justify-between items-center fixed top-0 left-0 w-full h-16 bg-white border-b-4 border-purple-100 p-5 shadow-sm lg:hidden">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
                <Image src="/assets/images/logo-text.png" alt="Logo" width={120} height={18} />
            </Link>

            {/* Navigation & User Menu */}
            <nav className="flex items-center gap-3">
                <SignedIn>
                    <UserButton />
                    
                    {/* Mobile Sidebar (Sheet) */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Image 
                            src='/assets/icons/menu.svg'
                            alt="menu"
                            height={32}
                            width={32}
                            />
                        </SheetTrigger>

                        <SheetContent side="right" className="w-64 p-5 bg-white">
                            <SheetHeader>
                                <SheetTitle>Navigation</SheetTitle>
                            </SheetHeader>

                            <ul className="mt-4 flex flex-col gap-3">
                                {navLinks.map((link) => {
                                    const isActive = link.route === pathname;
                                    return (
                                        <li key={link.route}>
                                            <Link
                                                href={link.route}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-md font-semibold transition-all ${
                                                    isActive
                                                        ? "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
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
                        </SheetContent>
                    </Sheet>
                </SignedIn>
            </nav>
        </header>
    );
};

export default MobileNav;
