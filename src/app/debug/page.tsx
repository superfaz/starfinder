export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <h1>Debugging</h1>
      <pre>
        {JSON.stringify({
          VERCEL_URL: process.env.VERCEL_URL,
          VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
          VERCEL_PRODUCTION_ID: process.env.VERCEL_PRODUCTION_ID,
        })}
      </pre>
    </div>
  );
}
