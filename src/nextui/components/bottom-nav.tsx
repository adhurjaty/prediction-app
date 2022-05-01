import Link from 'next/link'
import { useRouter } from 'next/router'

interface NavLink {
    label: string;
    href: string;
    icon: JSX.Element;
}
interface Props {
    links: NavLink[]
}

const BottomNav = ({ links }: Props) => {
	const router = useRouter()

	return (
		<div className='sm:hidden'>
			<nav className='pb-safe w-full bg-zinc-100 border-t dark:bg-zinc-900 dark:border-zinc-800 fixed bottom-0'>
				<div className='mx-auto px-6 max-w-md h-16 flex items-center justify-around'>
					{links.map(({ href, label, icon }) => (
						<Link key={label} href={href}>
							<a
								className={`space-y-1 w-full h-full flex flex-col items-center justify-center ${
									router.pathname === href
										? 'text-indigo-500 dark:text-indigo-400'
										: 'text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50'
								}`}
							>
								{icon}
								<span className='text-xs text-zinc-600 dark:text-zinc-400'>
									{label}
								</span>
							</a>
						</Link>
					))}
				</div>
			</nav>
		</div>
	)
}

export default BottomNav