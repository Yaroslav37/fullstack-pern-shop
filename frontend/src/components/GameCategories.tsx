import { Link } from 'react-router-dom'

export default function GameCategories() {
  const games = [
    {
      id: 1,
      title: 'Brawl Stars',
      publisher: 'Supercell',
      genre: 'Action',
      image: 'https://supercell.com/_next/static/media/nita.09048305.webp',
      backgroundColor: 'bg-red-600',
      to: '/category/brawl-stars',
    },
    {
      id: 2,
      title: 'Clash Royale',
      publisher: 'Supercell',
      genre: 'Strategy',
      image:
        'https://creators.supercell.com/img/character-goblin.a6847d8a.avif',
      backgroundColor: 'bg-green-500',
      to: '/category/clash-royale',
    },
    {
      id: 3,
      title: 'Clash of Clans',
      publisher: 'Supercell',
      genre: 'Strategy',
      image:
        'https://supercell.com/_next/static/media/princess_red_bow.6ce1177d.webp',
      backgroundColor: 'bg-blue-500',
      to: '/category/clash-of-clans',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-32 py-8 bg-">
      {games.map((game) => (
        <Link
          key={game.id}
          to={game.to}
          className="group relative overflow-hidden rounded-2xl transition-transform hover:scale-105"
        >
          <div className={`${game.backgroundColor} p-6 aspect-square`}>
            <div className="relative h-full">
              <img
                src={game.image}
                alt={game.title}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h2 className="text-2xl font-bold mb-1">{game.title}</h2>
              <div className="flex items-center justify-between">
                <span className="text-sm opacity-90">{game.publisher}</span>
                <span className="text-sm font-medium text-yellow-300 ">
                  {game.genre}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}
