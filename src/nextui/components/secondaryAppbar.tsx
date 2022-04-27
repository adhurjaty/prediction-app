import Link from 'next/link'
import { useRouter } from 'next/router'
import BackButton from './backButton'

interface Props {
    name?: string
}

const SecondaryAppBar = ({ name }: Props) => {
	const router = useRouter()

	return (
        <div className='pt-safe w-full bg-zinc-900 fixed top-0 left-0 z-20'>
            <BackButton />
			<header className='px-safe bg-zinc-100 border-b dark:bg-zinc-900 dark:border-zinc-800'>
				<div className='mx-auto px-6 max-w-screen-md h-20 flex items-center justify-between'>
					<Link href='/'>
						<a>
                            <h1 className='font-medium'>{name || 'Page'}</h1>
						</a>
					</Link>

					<nav className='space-x-6 flex items-center'>
						<div className='hidden sm:block'>
							<div className='space-x-6 flex items-center'>
								
							</div>
						</div>

						<div
							title='Gluten Free'
							className='w-10 h-10 bg-zinc-200 dark:bg-zinc-800 bg-cover bg-center rounded-full shadow-inner'
							style={{
								backgroundImage:
									'url(https://images.unsplash.com/photo-1612480797665-c96d261eae09?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80)',
							}}
						/>
					</nav>
				</div>
			</header>
		</div>
	)
}

export default SecondaryAppBar
