import {
    Box,
    Paper,
    Typography,
} from '@mui/material';

export function ContentLayout({
    title,
    children,
}: {
    title?: string;
    children: React.ReactNode;
}) {
    return (
        <Box sx={{ width: '100%', height: '100%', p: 3 }}>

            {title && (
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                >
                    {title}
                </Typography>
            )}

            <Box sx={{ mt: 4, pl: 1 }}>
                {children}
            </Box>
        </Box>
    );
}