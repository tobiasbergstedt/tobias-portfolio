'use client'

import { useState } from 'react'
import clsx from 'clsx'

import styles from './Header.module.scss'

const Header = () => {
	const [isOpen, setIsOpen] = useState(false)
	const toggleMenu = () => setIsOpen(!isOpen)

	return (
		<header className={styles.header}>
			<div className={styles.headerInnerWrapper}>
				<div className={styles.logo}>Logo</div>
				<button
					className={clsx(styles.hamburger, {
						[styles.active]: isOpen,
					})}
					onClick={toggleMenu}
				>
					<span></span>
					<span></span>
					<span></span>
				</button>
				<nav className={`${styles.nav} ${isOpen ? styles.show : ''}`}>
					<ul>
						<li>
							<a href="/">Home</a>
						</li>
						<li>
							<a href="#about">About</a>
						</li>
						<li>
							<a href="/skills">Skills</a>
						</li>
						<li>
							<a href="/projects">Projects</a>
						</li>
						<li>
							<a href="/contact">Contact</a>
						</li>
					</ul>
				</nav>
			</div>
		</header>
	)
}

export default Header
