import { TfiTimer } from "react-icons/tfi";
import { GiInvertedDice6 } from "react-icons/gi";
import { MdOutlineScoreboard } from "react-icons/md";
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
        heading={"Score Board"}
        desc={"Coming soon!"}
        Icon={MdOutlineScoreboard}
        href={"/scoreboard"}
      />
    </div>
  );
}
