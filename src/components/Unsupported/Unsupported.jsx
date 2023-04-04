import { Footer, FooterInProgress } from "../Footer/Footer";
import { Header } from "../Header/Header";
import styles from "./Unsupported.module.css";
import unsupportedImageSrc from "../../assets/unsupported-image.svg";

export function Unsupported() {
  return (
    <div className={styles.container}>
      <Header />

      <section className={styles.content}>
        <img
          className={styles.image}
          src={unsupportedImageSrc}
          alt="Unsupported Device"
        />

        <h1 className={styles.title}>Unsupported Device</h1>

        <p className={styles.description}>
          Please run this demo in mobile Safari browser on iPhone or iPad.
        </p>
      </section>

      <Footer />
    </div>
  );
}

export function UnsupportedMode() {
  return (
    <div className={styles.container}>
      <Header />
      <section className={styles.content}>
        <img
          className={styles.image}
          src={unsupportedImageSrc}
          alt="Expecting Normal Mode"
        />

        <h1 className={styles.title}>
          Expecting <br /> Normal Mode
        </h1>

        <p className={styles.description}>
          The demo works only in non-private Safari tabs and may not work inside
          application's Webview
        </p>
      </section>
      <FooterInProgress />
    </div>
  );
}
