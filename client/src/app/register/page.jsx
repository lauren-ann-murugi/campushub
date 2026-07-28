import LoginScreen from "@/screens/LoginScreen/LoginScreen";

export const metadata = {
  title: "Register - CampusHub",
  description: "Create a new CampusHub account",
};

export default function RegisterPage() {
  return <LoginScreen initialTab="register" />;
}