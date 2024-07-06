import Image from "next/image";
import Link from "next/link";

const HeaderLogo = () => {
  return (
    <Link href="/">
      <div className="items-center hidden lg:flex gap-2">
        <Image src="logo.svg" alt="logo" width={28} height={28} />
        <p className="text-white font-semibold text-2xl">Finance</p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
