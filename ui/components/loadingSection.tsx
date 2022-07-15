import Redirect from "./redirect"

interface Props {
    children: React.ReactNode,
    loading: boolean,
    error?: string
}

const LoadingSection = ({ children, loading, error }: Props) => {
    if (error) {
        // may want to move this elsewhere or rename the component because it doesn't
        // lie under the umbrella of Loading
        if (error === "User not registered") {
            return <Redirect path="/user/register" />
        }
        return (
            <div>Error fetching data: { error }</div>
        )
    }
    if (loading) {
        return (
            <div>Loading...</div>
        )
    }
    return (
        <section>{children}</section>
    )
}

export default LoadingSection;