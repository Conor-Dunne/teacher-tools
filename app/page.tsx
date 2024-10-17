import { TfiTimer } from "react-icons/tfi";
import { GiInvertedDice6 } from "react-icons/gi";
import Link from "next/link";

export default function Home() {
  return (
    <div className=" flex justify-center gap-10 my-10" >
  <Link href={"/timer"}>
  <div className="card bg-base-100 w-96 shadow-xl">
  <figure className="px-10 pt-10">
  <TfiTimer className=" text-9xl" />  
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Timer</h2>
    <p>Time is of the essence!</p>
  </div>
</div>
  </Link>
  <Link href={"/"}>
  <div className="card bg-base-100 w-96 shadow-xl">
  <figure className="px-10 pt-10">
  <GiInvertedDice6 className=" text-9xl" />  
  </figure>
  <div className="card-body items-center text-center">
    <h2 className="card-title">Dice</h2>
    <p>Coming soon!</p>
  </div>
</div>
  </Link>
    </div>
  );
}
