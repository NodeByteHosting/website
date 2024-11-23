'use client';

import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { Accordion, AccordionItem } from '@nextui-org/react';
import s from './styles/Header.module.scss';
import { usePathname } from 'next/navigation';
import { SiGithub, SiDiscord } from 'react-icons/si';
import { Logo } from '@/src/app/components/UI/Logo/Logo';
import ExtraLinksDropdown from './components/ExtraLinks';
import { DATA_NAVBAR_LINKS } from './utils/DesktopLinks';
import { DATA_TOGGLE_MENU_LINKS } from './utils/MobileLinks';
import {
  Navbar,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Tooltip,
} from '@nextui-org/react';

export const Header: FC = () => {
  const pathName = usePathname().replace('/', '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isBurgerActive, setBurgerActive] = useState(false);
  const [isScroll, setScroll] = useState<boolean>(false);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY != 0) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }, [isScroll]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setBurgerActive(!isBurgerActive);
  };

  return (
    <>
      <Navbar
        onMenuOpenChange={setIsMenuOpen}
        isMenuOpen={isMenuOpen}
        isBlurred={false}
        maxWidth="full"
        height={'3.7rem'}
        className={`${s.Header} bg-gradient-to-tl from-grey-900 via-dark_gray to-black border-gray-200 px-4 lg:px-6 py-2.5 ${pathName === '' ? '' : 'shadow-sm'
          }`}
      >
        <div className="container">
          <section className={s.Wrapper}>
            <Link
              className={s.Logo}
              href={'/'}
              onClick={() => setIsMenuOpen(false)}
            >
              <Logo />
              <span translate="no" className="-ml-6">
                odeByte
              </span>
            </Link>
            <nav className={s.Nav}>
              <ul className="hidden lg:flex">
                {DATA_NAVBAR_LINKS.map((link, i) => (
                  <li key={i}>
                    <Link
                      className={`text-white hover:text-blue ${pathName === link.href ? `${s.active} text-blue` : ''
                        }`}
                      href={link.href}
                    >
                      {link.value}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="hidden lg:flex items-center space-x-4">
                <ExtraLinksDropdown />
              </div>
              <NavbarMenuToggle
                onClick={toggleMenu}
                className={`${s.Burger} text-blue lg:hidden`}
              />
            </nav>
            {/* Mobile Menu */}
            <NavbarMenu
              className={`z-index2000 border-t-1 border-gray/10 bg-gradient-to-tl from-grey-900 via-dark_gray to-black border-gray-200 px-1 lg:hidden`}
            >
              <Accordion isCompact className={s.Accordion}>
                {DATA_TOGGLE_MENU_LINKS.map((item, i) => (
                  <AccordionItem
                    key={i}
                    title={item.title}
                    classNames={{
                      title: 'text-white ',
                    }}
                  >
                    <NavbarMenuItem className="grid gap-3" key={`${item}-${i}`}>
                      {item.links.map((link, i) => (
                        <Link
                          onClick={() => setIsMenuOpen(false)}
                          className={`relative text-sm  ml-2 pl-3 before:block before:absolute before:w-1 before:h-1 before:top-2 before:left-0 before:rounded-full ${pathName === link.href
                            ? `text-green before:bg-green `
                            : 'before:bg-gray/30 text-gray '
                            }`}
                          key={i}
                          href={link.href}
                        >
                          {link.value}
                        </Link>
                      ))}
                    </NavbarMenuItem>
                  </AccordionItem>
                ))}
              </Accordion>
              <div className={s.Actions}>
                <Tooltip
                  content="GitHub"
                  size="sm"
                  showArrow
                  className="bg-zinc-800 text-white"
                >
                  <div className={`${s.Social} hover:bg-zinc-800`}>
                    <Link
                      target="_blank"
                      href={'https://github.com/NodeByteHosting'}
                    >
                      <SiGithub
                        strokeWidth={1.5}
                        className="text-white/70"
                        size={20}
                      />
                    </Link>
                  </div>
                </Tooltip>
                <Tooltip
                  content="Discord"
                  size="sm"
                  showArrow
                  className="bg-zinc-800 text-white"
                >
                  <div className={`${s.Social} hover:bg-zinc-800`}>
                    <Link
                      target="_blank"
                      href={'https://discord.gg/nodebyte'}
                    >
                      <SiDiscord
                        strokeWidth={1.5}
                        className="text-white/70"
                        size={20}
                      />
                    </Link>
                  </div>
                </Tooltip>
              </div>
              <div
                className={`${s.Copyright} pt-2 mx-2 text-center text-gray text-sm mt-4  border-t-1 border-gray/10`}
              >
                &copy; 2024 NodeByte LTD | All rights reserved.
              </div>
            </NavbarMenu>
          </section>
        </div>
      </Navbar>
    </>
  );
};