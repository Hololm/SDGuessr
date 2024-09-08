"use client"

import * as React from "react"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {SearchIcon, MapIcon, Search} from "lucide-react"; // Use lucide icons (SVGs)

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const NavBar: React.FC = () => {
  return (
    <nav className="navbar w-full h-20 bg-gray-100">
      <div className="container mx-auto flex justify-between items-center h-full">

        {/* Left Side Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-4">
            <NavigationMenuItem>
              Home
              <NavigationMenuContent>
                <NavigationMenuLink href="/">Home</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              About
              <NavigationMenuContent>
                <NavigationMenuLink href="/">About</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              Contact
              <NavigationMenuContent>
                <NavigationMenuLink href="/">Contact</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Centered Search Bar */}
        <div className="search-bar flex items-center border border-gray-300 rounded-full p-2 bg-white w-full max-w-lg">
          <SearchIcon className="icon-left text-gray-500" />
          <Input
            type="text"
            placeholder="Enter city, address, or coordinates"
            className="search-input flex-grow border-none outline-none px-4"
          />
          <MapIcon className="icon-right text-gray-500" />
        </div>

        {/* Right Side (Optional) */}
        <div className="flex items-center space-x-4">
          {/* Add any buttons or other elements on the right */}
          <button className="px-4 py-2 bg-blue-500 text-white rounded-full">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"

export default NavBar;
