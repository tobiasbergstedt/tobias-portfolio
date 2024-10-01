import Image from 'next/image'
import Trial from '@components/Trial/Trial'

import styles from './page.module.scss'

const About = () => {
	return (
		<main className={styles.main}>
			<p>Tja!</p>
		</main>
	)
}

export default About

export const metadata = {
	title: 'About me',
	description: 'About Tobias Bergstedt',
}
