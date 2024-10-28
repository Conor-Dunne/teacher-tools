import { TfiTimer } from "react-icons/tfi";
import { GiInvertedDice6 } from "react-icons/gi";
import { PiSpinnerDuotone } from "react-icons/pi";
import ToolCard from "./components/toolCard";

export default function Home() {
  return (
    <div className=" flex flex-wrap justify-center gap-10 my-10">
      <ToolCard
        heading={"Timer"}
        desc={"Time is of the essence"}
        Icon={TfiTimer}
        href={"/timer"}
      />
       <ToolCard
        heading={"Dice"}
        desc={"Let's Roll!"}
        Icon={GiInvertedDice6}
        href={"/dice"}
      />
       <ToolCard
        heading={"Number Wheel"}
        desc={"Let's Spin!"}
        Icon={PiSpinnerDuotone}
        href={"/roulette"}
      />
    </div>
  );
}
