import { Link } from 'react-router-dom';

interface CategoryCardProps {
  name: string;
  image: string;
  count: number;
}

export default function CategoryCard({ name, image, count }: CategoryCardProps) {
  return (
    <Link
      to={`/search?category=${encodeURIComponent(name)}`}
      className="group flex flex-col items-center space-y-2"
    >
      <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
      </div>
      <span className="font-medium text-gray-800 group-hover:text-red-500 transition-colors text-center">
        {name}
      </span>
      <span className="text-xs text-gray-500">{count} places</span>
    </Link>
  );
}
