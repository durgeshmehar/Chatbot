import React from "react";
import Link from "next/link";

function notfound() {
  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-8 lg:px-8">
      <div className="text-center">
        <p className="mt-4 absolute left-1/2  transform -translate-x-1/2 text-5xl font-semibold text-black-300  lg:mt-28">
          404
        </p>
        <img src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"></img>
        <div className="relative lg:-top-28 left-1/2  transform -translate-x-1/2">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Look like you're lost
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            the page you are looking for not avaible!
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default notfound;
