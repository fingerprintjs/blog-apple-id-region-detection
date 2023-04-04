import { FooterInProgress } from "../Footer/Footer";
import { Header } from "../Header/Header";
import styles from "./InProgress.module.css";
import countryMap from "../../data/apple-regions.json";
import { getDemoState } from "../../state";

export function InProgress() {
  const { demoState } = getDemoState();

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.content}>
        <h1 className={styles.title}>Detecting...</h1>

        <p className={styles.countries}>
          {demoState.searchScope
            .map((countryCode) => countryMap[countryCode])
            .join(", ")}
        </p>
      </section>

      <FooterInProgress />
    </div>
  );
}
