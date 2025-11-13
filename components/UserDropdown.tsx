'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {LogOut} from "lucide-react";
import NavItems from "@/components/NavItems";
import {signOut} from "@/lib/actions/auth.actions";

const UserDropdown = ({ user, initialStocks }: {user: User, initialStocks: StockWithWatchlistStatus[]}) => {
    const router = useRouter();

    const handleSignOut = async () => {
        await signOut();
        router.push("/sign-in");
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-3 text-gray-4 hover:text-yellow-500">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src="data:image/jpeg;base64,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" />
                        <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                            {user.name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                        <span className='text-base font-medium text-gray-400'>
                            {user.name}
                        </span>
                    </div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="text-gray-400">
                <DropdownMenuLabel>
                    <div className="flex relative items-center gap-3 py-2">
                        <Avatar className="h-10 w-10">
                            <AvatarImage src="https://avatars.githubusercontent.com/u/153423955?s=280&v=4" />
                            <AvatarFallback className="bg-yellow-500 text-yellow-900 text-sm font-bold">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                            <span className='text-base font-medium text-gray-400'>
                                {user.name}
                            </span>
                            <span className="text-sm text-gray-500">{user.email}</span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-600"/>
                <DropdownMenuItem onClick={handleSignOut} className="text-gray-100 text-md font-medium focus:bg-transparent focus:text-yellow-500 transition-colors cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2 hidden sm:block" />
                    Logout
                </DropdownMenuItem>
                <DropdownMenuSeparator className="hidden sm:block bg-gray-600"/>
                <nav className="sm:hidden">
                    <NavItems initialStocks={initialStocks} />
                </nav>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
export default UserDropdown