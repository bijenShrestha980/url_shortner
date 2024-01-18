"use client";
import axios from "axios";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [myUrl, setMYURL] = useState("");
  const [shortUrl, setShortUrl] = useState("");

  const headers = {
    "Content-Type": "application/json",
    apikey: process.env.NEXT_PUBLIC_BASE_URL,
    // workspace: "YOUR_WORKSPACE_ID",
  };

  const shorten = async (url) => {
    let endpoint = "https://api.rebrandly.com/v1/links";
    let linkRequest = {
      destination: url,
      domain: { fullName: "rebrand.ly" },
      //, slashtag: "A_NEW_SLASHTAG"
      //, title: "Rebrandly YouTube channel"
    };
    const apiCall = {
      method: "post",
      url: endpoint,
      data: linkRequest,
      headers: headers,
    };
    setLoading(true);
    try {
      let apiResponse = await axios(apiCall);
      if (apiResponse.status !== 200) {
        throw new Error(`Status code was ${apiResponse.status}`);
      }
      let link = apiResponse.data;
      setLoading(false);
      return link.shortUrl;
    } catch (err) {
      console.error(err);
      setLoading(false);
      return err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const shortURL = await shorten(myUrl);
    setShortUrl(shortURL);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form
        onSubmit={(e) => handleSubmit(e)}
        className="min-h-screen flex justify-center flex-col gap-4"
      >
        <input
          className="p-2 border-2 border-gray-300 rounded-lg w-[500px] text-center"
          type="url"
          placeholder="Enter your URL here"
          onChange={(e) => setMYURL(e.target.value)}
          required
        />
        <button className="p-2 bg-zinc-900 text-white rounded-lg ease-in-out transition-all hover:scale-105 active:scale-95">
          {loading ? "Please wait..." : "Shorten it"}
        </button>
        {shortUrl ? (
          <div className=" w-full flex flex-col items-center gap-4">
            <p className="text-center font-bold text-lg py-6 bg-emerald-600 text-white rounded-lg w-full">
              {shortUrl}
            </p>
            <img
              src={`https://${shortUrl}.qr`}
              alt="shortened qr"
              className="h-40 w-40"
            />
          </div>
        ) : null}
      </form>
    </main>
  );
}
