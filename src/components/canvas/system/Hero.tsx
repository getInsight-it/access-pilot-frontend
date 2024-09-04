import { Fragment, useState } from 'react'
import { Bookmark, Calendar, ChartBarBig, ChevronDown, Home, Menu, Phone, Play, RefreshCcw, Shield, TextCursor, View, X } from 'lucide-react';
import Image from 'next/image';

type Feature = {
  name: string;
  href: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type CallToAction = {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type Resource = {
  name: string;
  description: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

type RecentPost = {
  id: number;
  name: string;
  href: string;
};

const features: Feature[] = [
  {
    name: 'Analytics',
    href: '#',
    description: 'Get a better understanding of where your traffic is coming from.',
    icon: ChartBarBig
  },
  {
    name: 'Engagement',
    href: '#',
    description: 'Speak directly to your customers in a more meaningful way.',
    icon: TextCursor
  },
  { name: 'Security', href: '#', description: "Your customers' data will be safe and secure.", icon: Shield },
  {
    name: 'Integrations',
    href: '#',
    description: "Connect with third-party tools that you're already using.",
    icon: View
  },
  {
    name: 'Automations',
    href: '#',
    description: 'Build strategic funnels that will drive your customers to convert',
    icon: RefreshCcw
  }
]

const callsToAction: CallToAction[] = [
  { name: 'Watch Demo', href: '#', icon: Play },
  { name: 'Contact Sales', href: '#', icon: Phone }
]

const resources: Resource[] = [
  {
    name: 'Help Center',
    description: 'Get all of your questions answered in our forums or contact support.',
    href: '#',
    icon: Home
  },
  {
    name: 'Guides',
    description: 'Learn how to maximize our platform to get the most out of it.',
    href: '#',
    icon: Bookmark
  },
  {
    name: 'Events',
    description: 'See what meet-ups and other events we might be planning near you.',
    href: '#',
    icon: Calendar
  },
  { name: 'Security', description: 'Understand how we take your privacy seriously.', href: '#', icon: Shield }
]

const recentPosts: RecentPost[] = [
  { id: 1, name: 'Boost your conversion rate', href: '#' },
  { id: 2, name: 'How to use search engine optimization to drive traffic to your site', href: '#' },
  { id: 3, name: 'Improve your customer experience', href: '#' }
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function Example() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [solutionsOpen, setSolutionsOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)

  return (
    <div className="relative bg-gray-50">
      <div className="relative bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          {/* <div className="flex justify-between items-center py-6">
            <div className="flex justify-start">
              <a href="#">
                <span className="sr-only">Fluxo de trabalho</span>
                <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="" />
                <Image
                  className="w-8"
                  src="/sistemas/sis01.svg"
                  width={500}
                  height={500}
                  alt="Imagem do sistema"
                />
              </a>
            </div>
            <div className="-mr-2 -my-2">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <span className="sr-only">Abrir menu</span>
                <Menu className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <nav className="hidden space-x-10">
              <div className="relative">
                <button
                  onClick={() => setSolutionsOpen(!solutionsOpen)}
                  className={classNames(
                    solutionsOpen ? 'text-gray-900' : 'text-gray-500',
                    'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  )}
                >
                  <span>Soluções</span>
                  <ChevronDown
                    className={classNames(solutionsOpen ? 'text-gray-600' : 'text-gray-400', 'ml-2 h-5 w-5 group-hover:text-gray-500')}
                    aria-hidden="true"
                  />
                </button>

                {solutionsOpen && (
                  <div className="absolute -ml-4 mt-3 transform z-10 w-screen max-w-md px-0">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="relative grid bg-white px-5 py-6 gap-8 p-8">
                        {features.map((item) => (
                          <a key={item.name} href={item.href} className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
                            <item.icon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                            <div className="ml-4">
                              <p className="text-base font-medium text-gray-900">{item.name}</p>
                              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="py-5 bg-gray-50 flex space-y-0 space-x-10 px-8">
                        {callsToAction.map((item) => (
                          <div key={item.name} className="flow-root">
                            <a
                              href={item.href}
                              className="-m-3 p-3 flex items-center rounded-md text-base font-medium text-gray-900 hover:bg-gray-100"
                            >
                              <item.icon className="flex-shrink-0 h-6 w-6 text-gray-400" aria-hidden="true" />
                              <span className="ml-3">{item.name}</span>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Preço
              </a>
              <a href="#" className="text-base font-medium text-gray-500 hover:text-gray-900">
                Documentos
              </a>

              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  className={classNames(
                    moreOpen ? 'text-gray-900' : 'text-gray-500',
                    'group bg-white rounded-md inline-flex items-center text-base font-medium hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  )}
                >
                  <span>Mais</span>
                  <ChevronDown
                    className={classNames(moreOpen ? 'text-gray-600' : 'text-gray-400', 'ml-2 h-5 w-5 group-hover:text-gray-500')}
                    aria-hidden="true"
                  />
                </button>

                {moreOpen && (
                  <div className="absolute left-1/2 z-10 transform -translate-x-1/2 mt-3 px-2 w-screen max-w-md">
                    <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                      <div className="relative grid gap-6 bg-white px-5 py-6 p-8">
                        {resources.map((item) => (
                          <a key={item.name} href={item.href} className="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50">
                            <item.icon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                            <div className="ml-4">
                              <p className="text-base font-medium text-gray-900">{item.name}</p>
                              <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                            </div>
                          </a>
                        ))}
                      </div>
                      <div className="px-5 py-5 bg-gray-50">
                        <div>
                          <h3 className="text-sm tracking-wide font-medium text-gray-500 uppercase">Posts recentes</h3>
                          <ul className="mt-4 space-y-4">
                            {recentPosts.map((item) => (
                              <li key={item.id} className="text-base truncate">
                                <a href={item.href} className="font-medium text-gray-900 hover:text-gray-700">
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div className="mt-5 text-sm">
                          <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            {' '}
                            Ver todos os posts <span aria-hidden="true">&rarr;</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>
            <div className="hidden items-center justify-end">
              <a href="#" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                Entrar
              </a>
              <a
                href="#"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Cadastro
              </a>
            </div>
          </div> */}
        </div>

        {menuOpen && (
          <div className="absolute top-0 inset-x-0 z-10 p-2 transition transform origin-top-right">
            <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
              <div className="pt-5 pb-6 px-5">
                <div className="flex items-center justify-between">
                  <div>
                    <img className="h-8 w-auto" src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg" alt="Workflow" />
                  </div>
                  <div className="-mr-2">
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                    >
                      <span className="sr-only">Fechar menu</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <nav className="grid gap-y-8">
                    {features.map((item) => (
                      <a key={item.name} href={item.href} className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50">
                        <item.icon className="flex-shrink-0 h-6 w-6 text-indigo-600" aria-hidden="true" />
                        <span className="ml-3 text-base font-medium text-gray-900">{item.name}</span>
                      </a>
                    ))}
                  </nav>
                </div>
              </div>
              <div className="py-6 px-5 space-y-6">
                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                  <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">
                    Preço
                  </a>

                  <a href="#" className="text-base font-medium text-gray-900 hover:text-gray-700">
                    Documentos
                  </a>
                  {resources.map((item) => (
                    <a key={item.name} href={item.href} className="text-base font-medium text-gray-900 hover:text-gray-700">
                      {item.name}
                    </a>
                  ))}
                </div>
                <div>
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Cadastro
                  </a>
                  <p className="mt-6 text-center text-base font-medium text-gray-500">
                    Já é usuário?
                    <a href="#" className="text-indigo-600 hover:text-indigo-500">
                      Entrar
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <main>
        <div className="mx-auto max-w-7xl w-full pt-16 pb-20 text-center">
          <div className="px-4">
            <h1 className="tracking-tight font-extrabold text-gray-900 text-5xl">
              {/* <span className="block">Sistema</span> */}
              <Image
                className="w-32 mx-auto"
                src="/sistemas/sis01.svg"
                width={500}
                height={500}
                alt="Imagem do sistema"
              />
              <span className="block text-indigo-600 mt-4">CRM</span>
            </h1>
            {/* <p className="mt-3 max-w-md mx-auto text-gray-500 text-xl">
              Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo.
            </p> */}
            <div className="mt-10 flex justify-center">
              <div className=" rounded-md shadow mt-0 ml-3">
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-4xl font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Entrar
                </a>
              </div>
              <div className="rounded-md shadow mt-0 ml-3">
                <a
                  href="#"
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-4xl font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                >
                  Cadastrar
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-full h-72">
          <img
            className="absolute inset-0 w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1520333789090-1afc82db536a?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2102&q=80"
            alt=""
          />
        </div>
      </main>
    </div>
  )
}
