import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import { loginSchema, type LoginSchema } from "@/features/auth/login.schema";
import { useLogin } from "@/hooks/useLogin";
import { useAuthStore } from "@/store/auth.store";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";
import {
  formInputClassName,
  formLabelClassName,
} from "@/components/ui/formFieldStyles";

export default function LoginPage() {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const mutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginSchema) => {
    try {
      const response = await mutation.mutateAsync(values);
      login(response.token, response.user);
      toast.success("Logged in");
      navigate("/dashboard");
    } catch (error) {
      toast.error(
        isAxiosError(error)
          ? (error.response?.data?.message ?? "Login failed")
          : "Login failed"
      );
    }
  };

  const token = useAuthStore((s) => s.token);

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
   <section
        className="hidden items-center justify-center p-8 md:flex md:w-1/2 lg:p-12"
        aria-hidden="true"
      >
        <img
          src="/TEST TUBE MAN.png"
          alt=""
          className="max-h-[45vh] w-full max-w-xs object-contain md:max-w-sm lg:max-h-[70vh] lg:max-w-md"
        />
      </section>

      <section className="flex min-h-screen w-full items-center justify-center bg-card px-6 py-12 md:min-h-0 md:w-[55%] md:px-10 lg:px-16">
        <div className="w-full max-w-lg">
          <form onSubmit={handleSubmit(onSubmit)}>
            <img src="/logo.png" alt="Preproute" className="w-34 object-contain" />

            <div className="mt-8">
              <h1 className="text-3xl font-semibold text-foreground">Login</h1>
              <p className="mt-5 text-xs text-foreground">
                Use your company provided Login credentials
              </p>
            </div>

            <Input
              id="userId"
              label="User ID"
              autoComplete="username"
              placeholder="Enter User ID"
              containerClassName="mt-8 space-y-2 gap-5"
              labelClassName={formLabelClassName}
              className={formInputClassName}
              {...register("userId")}
              error={errors.userId?.message}
            />

            <PasswordInput
              id="password"
              label="Password"
              autoComplete="current-password"
              placeholder="Enter Password"
              containerClassName="mt-8 space-y-2"
              labelClassName={formLabelClassName}
              className={formInputClassName}
              {...register("password")}
              error={errors.password?.message}
            />

            <div className="mt-8">
              <button
                type="button"
                className="cursor-pointer text-sm text-primary hover:underline focus:outline-none"
                onClick={() => toast.error("Password reset isn't set up yet")}
              >
                Forgot Password?
              </button>
            </div>

            <div className="mt-8">
              <Button type="submit" loading={mutation.isPending}>
                Login
              </Button>
            </div>
          </form>
        </div>
      </section>


    </div>
  );
}
