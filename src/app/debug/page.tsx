export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <h1>Debugging</h1>
      <pre>
        {JSON.stringify({
          VERCEL_URL: process.env.VERCEL_URL,
          VERCEL_PROJECT_PRODUCTION_URL: process.env.VERCEL_PROJECT_PRODUCTION_URL,
        })}
      </pre>
    </div>
  );
}
