
export async function reportMapError(message: string, screen: string) {
    try {
        const response = await fetch(
            "https://dlwbvoqowqiugyjdfyax.supabase.co/functions/v1/report-map-error",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message,
                    screen,
                }),
            }
        );
    } catch (error) {
        console.log("Failed to send error report:", error);
    }
}
