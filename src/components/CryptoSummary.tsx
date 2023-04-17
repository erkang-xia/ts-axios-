import { Crypto } from "./Types";

export type AppProps = {
  crypto: Crypto;
};
export default function CryptoSummary({ crypto }: AppProps): JSX.Element {
  //({crypto} : AppProps) : JSX.Element
  //({crypto} : AppProps) input type restriction, JSX.Element return type restriction
  return <p>{crypto.name + " " + "$" + crypto.current_price}</p>;
}
