// True in `npm run dev`: empty content renders as dashed placeholder slots.
// In production builds, empty content is simply left out.
export const DEV = process.env.NODE_ENV !== 'production';
