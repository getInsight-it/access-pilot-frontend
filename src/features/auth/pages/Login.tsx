import { Logo } from "../../../common/components/Logo.tsx";
import { Button } from "../../../components/ui/button.tsx";
import { authService } from "../common/AuthService.ts";
import LoginBandCanvas from "../../../common/components/LoginBandCanvas.tsx";

export default function Login() {
  const signIn = async () => {
    await authService.signIn();
  };

  return (
    <>
      <div
        className="relative h-screen flex-col items-center justify-center lg:grid lg:max-w-none lg:grid-cols-2 lg:px-0">

        <div className="w-full lg:w-[50vw] flex justify-between items-center absolute top-0 right-0 p-6 lg:p-10">
          &nbsp;
          <Logo />
        </div>
        <div className="relative hidden h-full flex-col bg-background text-white lg:flex">
          <div className="absolute inset-0" />
          <LoginBandCanvas />
        </div>
        <div className="flex h-full items-center p-4 lg:p-8 bg-secondary">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col text-left ">
              <h1 className="text-2xl font-semibold tracking-tight">
                Acesse sua conta
              </h1>
            </div>
            <Button type="button" onClick={signIn}>Entrar</Button>
          </div>
        </div>
      </div>
    </>
  );
}


