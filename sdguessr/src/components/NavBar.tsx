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
    <nav className="navbar w-full h-20">
      <div className="container mx-auto flex h-full items-center">
        <div>
        {/* Left Side Navigation Links */}
        <NavigationMenu>
          <NavigationMenuList className="flex items-center space-x-16 text-xl">
            <NavigationMenuItem className="cursor-pointer transition-colors duration-200 hover:text-blue-500">
              SDGuessr
              <NavigationMenuContent>
                <NavigationMenuLink href="/">Home</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem className="cursor-pointer transition-colors duration-200 hover:text-blue-500">
              About
              <NavigationMenuContent>
                <NavigationMenuLink href="/">About</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem className="cursor-pointer transition-colors duration-200 hover:text-blue-500">
              Contact
              <NavigationMenuContent>
                <NavigationMenuLink href="/">Contact</NavigationMenuLink>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        </div>
        {/* Centered Search Bar and Filter Button */}
        <div className="flex-grow flex justify-center">
          <div className="flex items-center space-x-4">
          <div className="hover:border-blue-500 duration-200 search-bar flex items-center border border-gray-300 rounded-full p-2 bg-white w-96">
            <SearchIcon className="icon-left text-gray-600" />
            <input
              type="text"
              placeholder="Enter city, address, or coordinates"
              className="search-input flex-grow border-none outline-none px-4"
            />
            <MapIcon className="icon-right text-gray-600" />
          </div>
          <Button className="px-6 py-2 bg-black hover:bg-blue-500 text-white rounded-2xl">
            Filter
          </Button>
            </div>
        </div>


        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Add any buttons or other elements on the right */}
          <Button className="px-6 py-2 bg-black hover:bg-blue-500 text-white rounded-2xl">
            Sign Up
          </Button>
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
