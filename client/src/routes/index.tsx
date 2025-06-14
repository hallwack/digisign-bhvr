import { useState } from "react";
import { Link } from "react-router";

import beaver from "@/assets/beaver.svg";
import { Button } from "@/components/ui/button";
import honoClient from "@/lib/client";
import { withMetadata } from "@/providers/metadata-provider";

type ResponseType = Awaited<ReturnType<typeof honoClient.hello.$get>>;

function HomePage() {
  const [data, setData] = useState<
    Awaited<ReturnType<ResponseType["json"]>> | undefined
  >();

  async function sendRequest() {
    try {
      const res = await honoClient.api.hello.$get();
      if (!res.ok) {
        console.log("Error fetching data");
        return;
      }
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center gap-6">
      <a href="https://github.com/stevedylandev/bhvr" target="_blank">
        <img
          src={beaver}
          className="h-16 w-16 cursor-pointer"
          alt="beaver logo"
        />
      </a>
      <h1 className="text-5xl font-black">bhvr</h1>
      <h2 className="text-2xl font-bold">Bun + Hono + Vite + React</h2>
      <p>A typesafe fullstack monorepo</p>
      <div className="flex items-center gap-4">
        <Button onClick={sendRequest} className="cursor-pointer">
          Call API
        </Button>
        <Button variant="secondary" asChild>
          <a target="_blank" href="https://bhvr.dev">
            Docs
          </a>
        </Button>
        <Button asChild>
          <Link to="/login">Login/Dashboard</Link>
        </Button>
      </div>
      {data && (
        <pre className="rounded-md bg-gray-100 p-4">
          <code>
            Message: {data.message} <br />
            Success: {data.success.toString()}
          </code>
        </pre>
      )}
    </div>
  );
}

export default withMetadata(HomePage, {
  title: "Home",
  description: "Welcome to bhvr, a typesafe fullstack monorepo",
  keywords: ["bhvr", "bun", "hono", "vite", "react"],
  ogImage: "@/assets/beaver.svg",
  ogUrl: "https://bhvr.dev",
});
