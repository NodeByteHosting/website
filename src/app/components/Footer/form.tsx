import { FC } from "react";
import toast from "react-hot-toast";
import { Button } from "@nextui-org/react";
import { MyInput } from "../UI/Input/Input";

export const FooterForm: FC = ({ }) => {
  return (
    <form
      className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 bg-gray-800 rounded-lg shadow-md"
      action={async (formData) => {
        toast.success("Email sent successfully!");
      }}
    >
      <MyInput
        size="sm"
        variant="bordered"
        label="Enter your email here"
        name="email"
        type="email"
      />
      <Button
        size="md"
        type="submit"
        className="bg-black dark:bg-black_secondary text-white border-1 border-gray-300 hover:bg-gray-700 transition-colors duration-300"
      >
        Subscribe
      </Button>
    </form>
  );
};