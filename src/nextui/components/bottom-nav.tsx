import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react';

interface NavLink {
    label: string;
    href: string;
    icon: JSX.Element;
}
interface Props {
    links: NavLink[]
}

const BottomNav = ({ links }: Props) => {
    const pathname = window.location.pathname; // in case user visits the path directly. The BottomNavBar is able to follow suit.
    const [value, setValue] = useState(pathname);

	// const router = useRouter()

    return (
        <BottomNavigation
            showLabels
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
            }}
            sx={{ position: 'fixed', bottom: 0, width: 1.0 }}
        >
            {links.map(({ href, label, icon }) => (
                <BottomNavigationAction
                    key={href}
                    label={label} 
                    value={href} 
                    icon={icon} 
                    // component={Link} 
                    href={href}
                />
            ))}
        </BottomNavigation>
	)
}

export default BottomNav