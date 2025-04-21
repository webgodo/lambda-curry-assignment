import Medusa from "@medusajs/js-sdk"

export const sdk = new Medusa({
    baseUrl: import.meta.env.ADMIN_BACKEND_URL || "/",
    debug: import.meta.env.NODE_ENV === 'development',
    auth: {
        type: "session",
    },
})