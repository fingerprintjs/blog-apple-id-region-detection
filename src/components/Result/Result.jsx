import { FooterInProgress } from "../Footer/Footer";
import { Header } from "../Header/Header";
import styles from "./Result.module.css";
import countryMap from "../../data/apple-regions.json";
import { getDemoState } from "../../state";

export function Result() {
  const { demoState } = getDemoState();

  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.content}>
        <h1 className={styles.title}>Your Apple ID region is:</h1>

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
