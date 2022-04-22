interface Props {
    children: React.ReactNode,
    loading: boolean
}

const LoadingSection = ({ children, loading }: Props) => {
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