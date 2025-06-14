import { Route, Routes } from "react-router";

import { MetadataProvider } from "@/providers/metadata-provider";
import HomePage from "@/routes";
import AboutPage from "@/routes/about";
import AuthLayout from "@/routes/auth/layout";
import LoginPage from "@/routes/auth/login";
import Register from "@/routes/auth/register";
import RootLayout from "@/routes/layout";

function Root() {
  return (
    <MetadataProvider
      defaultMetadata={{ title: "My App", description: "Welcome to my app" }}
    >
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
        </Route>
      </Routes>
    </MetadataProvider>
  );
}

export default Root;
