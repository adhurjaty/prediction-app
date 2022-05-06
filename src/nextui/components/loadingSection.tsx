interface Props {
    children: React.ReactNode,
    loading: boolean,
    error?: string
}

const LoadingSection = ({ children, loading, error }: Props) => {
    if (error) {
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