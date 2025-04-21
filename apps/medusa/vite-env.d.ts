/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly ADMIN_BACKEND_URL?: string;
    readonly NODE_ENV?: 'development' | 'production' | 'test';
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}