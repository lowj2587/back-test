import GameCard from '@/components/GameCard'
import KeyboardLayout from '@/components/KeyboardLayout'
import Navbar from '@/components/Navbar'
import { ExternalLink, GithubIcon, Play, TwitterIcon } from 'lucide-react'
import { GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import Link from 'next/link'

interface GameInfo {
  title: string
  imageUrl: string
  serverName: string
  description: string
}

interface HomeProps {
  games: GameInfo[]
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: {
      games: [
        {
          title: 'Test Server',
          imageUrl: '/PreviewTestGame.webp',
          serverName: 'Test Server',
          description:
            'This is a test server for development purposes. Feel free to join and test the game.',
        },
        {
          title: 'Test Server',
          imageUrl: '/BigPreview.webp',
          serverName: 'Test Server',
          description:
            'This is a test server for development purposes. Feel free to join and test the game.',
        },
      ],
    },
  }
}

export default function Home({ games }: HomeProps) {
  return (
    <main className="p-4 area">
      <NextSeo
        title="NotBlox - Play multiplayer games in your browser"
        description="Play multiplayer games in your browser. Create your own games and share them with your friends."
        canonical="https://www.notblox.online/"
        openGraph={{
          title: 'NotBlox - Play multiplayer games in your browser',
          description:
            'Play multiplayer games in your browser. Create your own games and share them with your friends.',
          images: [
            {
              url: '/Logo.png',
              width: 800,
              height: 600,
              alt: 'NotBlox Logo',
              type: 'image/png',
            },
            {
              url: '/BigPreview.webp',
              width: 1200,
              height: 630,
              alt: 'NotBlox Logo',
              type: 'image/webp',
            },
          ],
          siteName: 'NotBlox Online',
        }}
        twitter={{
          handle: '@iercan_',
          site: '@iercan_',
          cardType: 'summary_large_image',
        }}
      />

      <div className="space-y-8  flex flex-col items-center circles">
        <Navbar />
        <p className="text-2xl">Play multiplayer games in your browser</p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {games.map((game, index) => (
            <GameCard
              key={index}
              title={game.title}
              imageUrl={game.imageUrl}
              serverName={game.serverName}
              description={game.description}
            />
          ))}
        </div>
        <KeyboardLayout />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 my-4">
          <Link
            href={'https://discord.gg/kPhgtj49U2'}
            className="flex py-2 items-center justify-center   px-8   font-medium   border border-transparent rounded-md hover:bg-gray-100   md:text-lg md:px-10"
          >
            <ExternalLink className="mr-2" />
            Project Discord
          </Link>
          <Link
            href={'https://twitter.com/iErcan_'}
            className="flex py-2 items-center justify-center  px-8   font-medium   border border-transparent rounded-md hover:bg-gray-100    md:text-lg md:px-10"
          >
            <TwitterIcon className="mr-2" />
            Twitter
          </Link>
          <Link
            href={'https://github.com/iErcann/Notblox'}
            className="flex py-2 items-center justify-center   px-8   font-medium  border border-transparent rounded-md hover:bg-gray-100   md:text-lg md:px-10"
          >
            <GithubIcon className="mr-2" />
            Source Code
          </Link>
        </div>
      </div>
    </main>
  )
}
