import { Outlet } from "react-router";

function RootLayout() {
  return (
    <div className="flex h-screen flex-col">
      <header className="bg-gray-800 p-4 text-white">
        <h1 className="text-xl">My Application</h1>
      </header>
      <main className="flex-1 p-4">
        <Outlet />
      </main>
      <footer className="bg-gray-800 p-4 text-center text-white">
        © 2023 My Application
      </footer>
    </div>
  );
}

export default RootLayout;
