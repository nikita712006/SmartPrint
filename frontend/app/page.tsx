import Navbar from "./components/Navbar";
import HowItWorks from "./components/HowItWorks";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white px-8 py-20">
        <div className="text-center max-w-4xl mx-auto">

          <div className="inline-block px-4 py-2 rounded-full bg-orange-100 text-orange-600 text-sm mb-6">
            ⚡ Smart Campus Print Management
          </div>

          <h1 className="text-5xl font-bold text-gray-900">
            Skip the Queue,{" "}
            <span className="text-orange-500">Print Smart</span>
          </h1>

          <p className="mt-6 text-lg text-gray-600">
            Upload, schedule, and pick up your prints from local shops —
            no more waiting during deadline season.
          </p>

          <div className="mt-10 flex justify-center gap-4">

            <Link href="/book">
              <button className="bg-orange-500 text-white px-6 py-3 rounded-lg text-lg hover:bg-orange-600 transition">
                Book Your Print →
              </button>
            </Link>

            <Link href="/login">
              <button
                className="border border-gray-400 px-6 py-3 rounded-xl 
                text-gray-900 font-semibold 
                hover:bg-gray-100 hover:border-gray-500 transition"
              >
                I’m a Print Shop
              </button>
            </Link>

          </div>

        </div> {/* ✅ THIS WAS MISSING */}

        <HowItWorks />
      </main>
    </>
  );
}