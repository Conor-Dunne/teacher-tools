import Link from "next/link";

export default function ToolCard({ heading, desc, Icon, href }) {
  return (
    <Link href={href}>
      <div className="card bg-base-100 w-96 shadow-xl">
        <figure className="px-10 pt-10">
          <Icon className="text-9xl" /> 
        </figure>
        <div className="card-body items-center text-center">
          <h2 className="card-title">{heading}</h2>
          <p>{desc}</p>
        </div>
      </div>
    </Link>
  );
}
