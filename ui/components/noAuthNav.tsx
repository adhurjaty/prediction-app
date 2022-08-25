import BottomNav from "./bottomNav";

const NoAuthNav = () => {
    const links = [
        {
            label: "Signin",
            href: "/auth/signin",
            icon: (<div>Signin</div>)
        },
        {
            label: "About",
            href: "/about",
            icon: (<div>About</div>)
        }
    
    ];

    return <BottomNav links={links} />
}

export default NoAuthNav;