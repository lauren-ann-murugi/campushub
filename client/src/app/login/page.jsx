import LoginScreen from "@/screens/LoginScreen/LoginScreen";

export const metadata = {
  title: "Sign In - CampusHub",
  description: "Sign in to your CampusHub account",
};

export default function LoginPage() {
  return <LoginScreen initialTab="login" />;
}