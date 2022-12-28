import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";

export default function Home() {
  // redirect to /maps
  if (typeof window !== "undefined") {
    window.location.href = "/maps";
  }

  return <h1>Redirecting...</h1>;
}
