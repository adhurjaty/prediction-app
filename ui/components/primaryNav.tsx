import BottomNav from "./bottom-nav";

const PrimaryNav = () => {
    const links = [
        {
            label: 'Groups',
            href: '/groups',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="20" viewBox="0 0 24 20">
                    <path d="M10.118 16.064c2.293-.529 4.428-.993 3.394-2.945-3.146-5.942-.834-9.119 2.488-9.119 3.388 0 5.644 3.299 2.488 9.119-1.065 1.964 1.149 2.427 3.394 2.945 1.986.459 2.118 1.43 2.118 3.111l-.003.825h-15.994c0-2.196-.176-3.407 2.115-3.936zm-10.116 3.936h6.001c-.028-6.542 2.995-3.697 2.995-8.901 0-2.009-1.311-3.099-2.998-3.099-2.492 0-4.226 2.383-1.866 6.839.775 1.464-.825 1.812-2.545 2.209-1.49.344-1.589 1.072-1.589 2.333l.002.619z" />
                </svg>
            )
        },
        {
            label: 'Friends',
            href: '/friends',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M20.822 18.096c-3.439-.794-6.64-1.49-5.09-4.418 4.72-8.912 1.251-13.678-3.732-13.678-5.082 0-8.464 4.949-3.732 13.678 1.597 2.945-1.725 3.641-5.09 4.418-3.073.71-3.188 2.236-3.178 4.904l.004 1h23.99l.004-.969c.012-2.688-.092-4.222-3.176-4.935z" />
                </svg>
            )
        },
        {
            label: 'Bets',
            href: '/bets',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M17 12c-3.313 0-6 2.687-6 6s2.687 6 6 6 6-2.687 6-6-2.687-6-6-6zm.5 8.474v.526h-.5v-.499c-.518-.009-1.053-.132-1.5-.363l.228-.822c.478.186 1.114.383 1.612.27.574-.13.692-.721.057-1.005-.465-.217-1.889-.402-1.889-1.622 0-.681.52-1.292 1.492-1.425v-.534h.5v.509c.362.01.768.073 1.221.21l-.181.824c-.384-.135-.808-.257-1.222-.232-.744.043-.81.688-.29.958.856.402 1.972.7 1.972 1.773.001.858-.672 1.315-1.5 1.432zm1.624-10.179c1.132-.223 2.162-.626 2.876-1.197v.652c0 .499-.386.955-1.007 1.328-.581-.337-1.208-.6-1.869-.783zm-2.124-5.795c2.673 0 5-1.007 5-2.25s-2.327-2.25-5-2.25c-2.672 0-5 1.007-5 2.25s2.328 2.25 5 2.25zm.093-2.009c-.299-.09-1.214-.166-1.214-.675 0-.284.334-.537.958-.593v-.223h.321v.211c.234.005.494.03.784.09l-.116.342c-.221-.051-.467-.099-.708-.099l-.072.001c-.482.02-.521.287-.188.399.547.169 1.267.292 1.267.74 0 .357-.434.548-.967.596v.22h-.321v-.208c-.328-.003-.676-.056-.962-.152l.147-.343c.244.063.552.126.828.126l.208-.014c.369-.053.443-.3.035-.418zm-11.093 13.009c1.445 0 2.775-.301 3.705-.768.311-.69.714-1.329 1.198-1.899-.451-1.043-2.539-1.833-4.903-1.833-2.672 0-5 1.007-5 2.25s2.328 2.25 5 2.25zm.093-2.009c-.299-.09-1.214-.166-1.214-.675 0-.284.335-.537.958-.593v-.223h.321v.211c.234.005.494.03.784.09l-.117.342c-.22-.051-.466-.099-.707-.099l-.072.001c-.482.02-.52.287-.188.399.547.169 1.267.292 1.267.74 0 .357-.434.548-.967.596v.22h-.321v-.208c-.329-.003-.676-.056-.962-.152l.147-.343c.244.063.552.126.828.126l.208-.014c.368-.053.443-.3.035-.418zm4.003 8.531c-.919.59-2.44.978-4.096.978-2.672 0-5-1.007-5-2.25v-.652c1.146.918 3.109 1.402 5 1.402 1.236 0 2.499-.211 3.549-.611.153.394.336.773.547 1.133zm-9.096-3.772v-.651c1.146.917 3.109 1.401 5 1.401 1.039 0 2.094-.151 3.028-.435.033.469.107.926.218 1.37-.888.347-2.024.565-3.246.565-2.672 0-5-1.007-5-2.25zm0-2.5v-.652c1.146.918 3.109 1.402 5 1.402 1.127 0 2.275-.176 3.266-.509-.128.493-.21 1.002-.241 1.526-.854.298-1.903.483-3.025.483-2.672 0-5-1.007-5-2.25zm11-11v-.652c1.146.918 3.109 1.402 5 1.402 1.892 0 3.854-.484 5-1.402v.652c0 1.243-2.327 2.25-5 2.25-2.672 0-5-1.007-5-2.25zm0 5v-.652c.713.571 1.744.974 2.876 1.197-.661.183-1.287.446-1.868.783-.622-.373-1.008-.829-1.008-1.328zm0-2.5v-.651c1.146.917 3.109 1.401 5 1.401 1.892 0 3.854-.484 5-1.401v.651c0 1.243-2.327 2.25-5 2.25-2.672 0-5-1.007-5-2.25z" />
                </svg>
    
            )
        },
        {
            label: 'Account',
            href: '/user/edit',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                    <path d="M3.44 2l-.439-2h17.994l-.439 2h-17.116zm-1.44 3l-.439-2h20.879l-.44 2h-20zm10.099 10.716l.004.283h-5.939l-.048-.292c-.133-.779-.177-1.224.582-1.43.842-.227 1.684-.429 1.168-1.289-1.627-2.546-.849-3.99.634-3.99 1.454 0 2.516 1.39 1.355 3.99-.348.854.5 1.056 1.401 1.289.801.208.834.655.843 1.439zm6.628-4.716h-4.784l-.028 1h4.675l.137-1zm.273-2h-5l-.028.999h4.892l.136-.999zm-.548 4h-4.566l-.029.999h4.459l.136-.999zm-.273 2h-4.351l-.028.999h4.241l.138-.999zm5.821 3h-24l2 6h20l2-6zm-20.625-2l-1.085-8.001h19.411l-1.119 8.001h2.021l1.397-10h-24l1.356 10h2.019z" />
                </svg>
            )
        }
    
    ];

    return <BottomNav links={links} />
}

export default PrimaryNav;