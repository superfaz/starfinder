export const dynamic = "force-dynamic";

export default function Page() {
  return (
    <div>
      <h1>Debugging</h1>
      <pre>{JSON.stringify({ VERCEL_URL: process.env.VERCEL_URL })}</pre>
    </div>
  );
}
