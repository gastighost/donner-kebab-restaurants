import { useState } from 'react';
import { useRouter } from 'next/router'
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/kebab-store.module.css';
import cls from 'classnames';

import { fetchKebabStores } from '../../lib/kebab-stores';

export async function getStaticProps({params}) {
  const results = await fetchKebabStores();
  return {
    props: {
      kebabStore: results.find(kebabStore => {
        return kebabStore.fsq_id.toString() === params.id;
      })
    }
  }
}

export async function getStaticPaths() {
  const results = await fetchKebabStores();
  const paths = results.map(kebabStore => {
    return {
      params: { id: kebabStore.fsq_id.toString() }
    }
  })
  return {
    paths: paths,
    fallback: true
  }
}

const DonerRestaurant = (props) => {
  const [vote, setVote] = useState(0)

  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>
  }

  const {location, name, imgUrl} = props.kebabStore

  const handleUpVoteButton = () => {
    console.log("Handle Upvote");
    setVote(vote + 1)
  }

  return (<div className={styles.layout}>
            <Head>
              <title>{name}</title>
            </Head>
            <div className={styles.container}>
              <div className={styles.col1}>
                <div className={styles.backToHomeLink}>
                  <Link href="/">
                    <a>← Back to home</a>
                  </Link>
                </div>
                <div className={styles.nameWrapper}>
                  <h1 className={styles.name}>{name}</h1>
                </div>
                <Image src={imgUrl}
                       width={600}
                       height={360}
                       className={styles.storeImg}
                       alt={name}/>
              </div>

              <div className={cls("glass", styles.col2)}>
                <div className={styles.iconWrapper}>
                  <Image src="/static/icon/nearMe.svg" width="24" height="24" alt={location.formatted_address}/>
                  <p className={styles.text}>{location.formatted_address}</p>
                </div>
                <div className={styles.iconWrapper}>
                  <Image src="/static/icon/neighborhood.svg" width="24" height="24" alt={location.postcode}/>
                  <p className={styles.text}>{location.postcode}</p>
                </div>
                <div className={styles.iconWrapper}>
                  <Image src="/static/icon/star.svg" width="24" height="24" alt=""/>
                  <p className={styles.text}>{vote}</p>
                </div>
                <button className={styles.upvoteButton}
                        onClick={handleUpVoteButton}>Up Vote</button>
              </div>
            </div>
          </div>)
}

export default DonerRestaurant;
