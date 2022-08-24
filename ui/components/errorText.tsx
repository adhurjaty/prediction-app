import { Typography } from "@mui/material"

interface Props {
    text: string
}

export default function ErrorText({ text }: Props) {
    return (
        <Typography
            variant="subtitle1"
            color="error"
            sx={{
                wordWrap: "break-word"
            }}
        >
            {text}
        </Typography>
    )
}