import Link from "next/link";
import airvillaLogo from "@/public/images/logo/airvilla charter-01.png";
import Image from "next/image";
export default function Logo() {
  return (
    <Link
      href="/"
      // className="flex justify-end sm:justify-center w-full mt-8"
    >
      <Image
        src={airvillaLogo}
        alt="logo"
        width={300}
        className="w-[130px] sm:w-[180px]"
        priority={true}
      ></Image>
    </Link>
  );
}
