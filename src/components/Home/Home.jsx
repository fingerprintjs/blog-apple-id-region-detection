import { Footer } from "../Footer/Footer";
import { Header } from "../Header/Header";
import styles from "./Home.module.css";
import heroImageSrc from "../../assets/hero-image.svg";

export function Home({ onStartClick }) {
  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.content}>
        <img
          className={styles.heroImage}
          src={heroImageSrc}
          alt="Apple ID Region Detection"
        />

        <h1 className={styles.title}>
          Unmasking <br /> Apple ID Region
        </h1>

        <p className={styles.description}>
          Explore the intriguing exploit that leverages smart app banners to
          reveal a user's Apple ID region without permissions
        </p>

        <button className={styles.button} onClick={onStartClick}>
          Start
        </button>
      </section>

      <Footer />
    </div>
  );
}
